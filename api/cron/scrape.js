// Vercel Cron Job for ANGSPE Scraper
// This runs automatically every 6 hours

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  // Only allow POST requests (Vercel cron requirement)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🚀 Starting scheduled ANGSPE scrape...');
    
    // Run the Python scraper
    const { stdout, stderr } = await execAsync('python3 scraper.py', {
      cwd: process.cwd(),
      timeout: 30000 // 30 second timeout
    });

    console.log('✅ Scraping completed successfully');
    console.log('Output:', stdout);
    
    if (stderr) {
      console.warn('Warnings:', stderr);
    }

    // Update the status file with new timestamp
    const statusData = {
      last_cron_run: new Date().toISOString(),
      status: 'success',
      message: 'Scheduled scrape completed successfully'
    };

    // Write status to a file that the main API can read
    fs.writeFileSync('data/cron_status.json', JSON.stringify(statusData, null, 2));

    return res.status(200).json({
      status: 'success',
      message: 'Scheduled scrape completed',
      timestamp: statusData.last_cron_run,
      output: stdout
    });

  } catch (error) {
    console.error('❌ Cron job failed:', error);
    
    // Log error to file for debugging
    const errorData = {
      last_cron_run: new Date().toISOString(),
      status: 'error',
      error: error.message,
      stack: error.stack
    };
    
    fs.writeFileSync('data/cron_error.json', JSON.stringify(errorData, null, 2));

    return res.status(500).json({
      status: 'error',
      message: 'Scheduled scrape failed',
      error: error.message,
      timestamp: errorData.last_cron_run
    });
  }
}
