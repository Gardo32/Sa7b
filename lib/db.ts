import { Pool } from 'pg';

// Connect to Neon PostgreSQL using the connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export async function executeQuery(text: string, params?: any[]): Promise<any> {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error', error);
    throw error;
  }
}

export async function getParticipants(program: 'Primary_Program' | 'Secondary_Program', ranking: string) {
  console.log(`Fetching participants from ${program} with ranking ${ranking}`);
  
  // Query to get unselected participants with a specific ranking
  const query = `
    SELECT * FROM ${program}
    WHERE ranking = $1 AND (selected IS NULL OR selected = FALSE)
    ORDER BY id ASC
  `;
  
  try {
    const result = await executeQuery(query, [ranking]);
    console.log(`Found ${result.rowCount} participants`);
    return result.rows;
  } catch (error) {
    console.error('Error in getParticipants:', error);
    throw error;
  }
}

export async function getSelectedParticipants(program: 'Primary_Program' | 'Secondary_Program', ranking?: string) {
  // Query to get selected participants
  let query = `
    SELECT * FROM ${program}
    WHERE selected = TRUE
  `;
  
  const params: any[] = [];
  
  if (ranking) {
    query += ' AND ranking = $1';
    params.push(ranking);
  }
  
  query += ' ORDER BY selection_date DESC';
  
  const result = await executeQuery(query, params);
  return result.rows;
}

export async function selectParticipant(
  program: 'Primary_Program' | 'Secondary_Program',
  participantId: number
) {
  const query = `
    UPDATE ${program}
    SET selected = TRUE, selection_date = NOW()
    WHERE id = $1
    RETURNING *
  `;
  const result = await executeQuery(query, [participantId]);
  return result.rows[0];
}

export async function unselectParticipant(
  program: 'Primary_Program' | 'Secondary_Program',
  participantId: number
) {
  const query = `
    UPDATE ${program}
    SET selected = FALSE, selection_date = NULL
    WHERE id = $1
    RETURNING *
  `;
  const result = await executeQuery(query, [participantId]);
  return result.rows[0];
}

export async function resetSelections(program: 'Primary_Program' | 'Secondary_Program') {
  const query = `
    UPDATE ${program}
    SET selected = FALSE, selection_date = NULL
    WHERE selected = TRUE
  `;
  return executeQuery(query);
}

export async function getGroupStats(program: 'Primary_Program' | 'Secondary_Program') {
  const query = `
    SELECT 
      group_name,
      COUNT(*) AS total,
      SUM(CASE WHEN selected = TRUE THEN 1 ELSE 0 END) AS selected,
      ROUND((SUM(CASE WHEN selected = TRUE THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric) * 100, 2) AS percentage
    FROM ${program}
    GROUP BY group_name
    ORDER BY group_name
  `;
  const result = await executeQuery(query);
  return result.rows;
}
