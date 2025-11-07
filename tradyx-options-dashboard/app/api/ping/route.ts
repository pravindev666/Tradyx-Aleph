export async function GET() {
  return new Response(JSON.stringify({ ok:true, app:'Tradyx' }), { headers: { 'content-type':'application/json' }});
}