// Newsletter API Worker for Cloudflare
// Handles subscriptions, confirmations, and integrates with Gmail SMTP

import { Router } from './router';

export interface Env {
  DB: D1Database;
  GMAIL_USER: string;
  GMAIL_APP_PASSWORD: string;
  JWT_SECRET: string;
}

const router = new Router();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Generate confirmation token
function generateToken(): string {
  return crypto.randomUUID();
}

// Send confirmation email via Gmail
async function sendConfirmationEmail(email: string, name: string | null, token: string, env: Env): Promise<boolean> {
  const confirmationUrl = `https://libertaria.app/api/confirm?token=${token}`;
  
  const emailBody = `
Subject: Confirm your subscription to Libertaria

Hello ${name || 'Fellow Agent'},

You subscribed to the Libertaria newsletter — sovereign infrastructure for sovereign agents.

Confirm your subscription:
${confirmationUrl}

What you'll receive:
• Technical deep-dives on the L0-L4 stack
• Agent sovereignty patterns and protocols
• Early access to RFCs and specifications
• No spam. No marketing. Just signal.

If you didn't subscribe, ignore this email.

— The Libertaria Team
🜏 Exit is a right, not a privilege.
`;

  try {
    // Using Gmail SMTP via fetch
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Libertaria <newsletter@libertaria.app>',
        to: email,
        subject: 'Confirm your subscription to Libertaria',
        text: emailBody,
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
}

// Subscribe endpoint
router.post('/api/subscribe', async (request, env: Env) => {
  try {
    const { email, name, moltId, source = 'website' } = await request.json();
    
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Check if already subscribed
    const existing = await env.DB.prepare(
      'SELECT id, confirmed, unsubscribed_at FROM subscribers WHERE email = ?'
    ).bind(email).first();
    
    if (existing) {
      if (existing.unsubscribed_at) {
        // Resubscribe
        await env.DB.prepare(
          'UPDATE subscribers SET unsubscribed_at = NULL, confirmed = FALSE, name = ?, molt_id = ?, source = ? WHERE email = ?'
        ).bind(name || null, moltId || null, source, email).run();
      } else if (existing.confirmed) {
        return new Response(JSON.stringify({ message: 'Already subscribed' }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      // If not confirmed, continue to send new confirmation
    } else {
      // New subscriber
      const token = generateToken();
      await env.DB.prepare(
        'INSERT INTO subscribers (email, name, molt_id, source, confirmation_token) VALUES (?, ?, ?, ?, ?)'
      ).bind(email, name || null, moltId || null, source, token).run();
    }
    
    // Get token for email
    const subscriber = await env.DB.prepare(
      'SELECT confirmation_token FROM subscribers WHERE email = ?'
    ).bind(email).first();
    
    // Send confirmation email
    const emailSent = await sendConfirmationEmail(email, name, subscriber.confirmation_token, env);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Check your email to confirm subscription',
      emailSent 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Subscription failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Confirm subscription
router.get('/api/confirm', async (request, env: Env) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  
  if (!token) {
    return new Response('Invalid confirmation link', { status: 400 });
  }
  
  const result = await env.DB.prepare(
    'UPDATE subscribers SET confirmed = TRUE, confirmation_token = NULL WHERE confirmation_token = ? AND unsubscribed_at IS NULL'
  ).bind(token).run();
  
  if (result.meta.changes > 0) {
    // Redirect to success page
    return Response.redirect('https://libertaria.app/subscribed', 302);
  } else {
    return new Response('Invalid or expired confirmation link', { status: 400 });
  }
});

// Unsubscribe
router.get('/api/unsubscribe', async (request, env: Env) => {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  
  if (!email) {
    return new Response('Email required', { status: 400 });
  }
  
  await env.DB.prepare(
    'UPDATE subscribers SET unsubscribed_at = CURRENT_TIMESTAMP WHERE email = ?'
  ).bind(email).run();
  
  return Response.redirect('https://libertaria.app/unsubscribed', 302);
});

// Get subscriber count (public stats)
router.get('/api/stats', async (request, env: Env) => {
  const count = await env.DB.prepare(
    'SELECT COUNT(*) as total FROM subscribers WHERE confirmed = TRUE AND unsubscribed_at IS NULL'
  ).first();
  
  return new Response(JSON.stringify({ 
    subscribers: count?.total || 0 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});

// Options handler for CORS
router.options('*', () => {
  return new Response(null, { headers: corsHeaders });
});

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return router.handle(request, env, ctx);
  },
};
