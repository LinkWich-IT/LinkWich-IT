export async function portalLogin(db,baseUrl,publishableKey,email,password){
 const response=await fetch(baseUrl+'/functions/v1/portal-login',{
  method:'POST',headers:{apikey:publishableKey,'Content-Type':'application/json'},
  body:JSON.stringify({email,password}),cache:'no-store',signal:AbortSignal.timeout(30000)
 });
 const payload=await response.json().catch(()=>null);
 if(!response.ok){const error=Error('No se pudo iniciar sesión. Revisa tus datos o contacta al administrador.');const known=['over_request_rate_limit','portal_account_locked','portal_invalid_password'];error.code=known.includes(payload?.code)?payload.code:response.status>=500?'portal_login_unavailable':'portal_login_failed';error.status=response.status;if(error.code==='portal_invalid_password'&&Number.isInteger(payload?.failed_attempts)&&payload.failed_attempts>=1&&payload.failed_attempts<=2)error.failed_attempts=payload.failed_attempts;throw error;}
 if(typeof payload?.access_token!=='string'||typeof payload?.refresh_token!=='string')throw Object.assign(Error('Respuesta de acceso inválida.'),{code:'portal_login_unavailable'});
 const {error}=await db.auth.setSession({access_token:payload.access_token,refresh_token:payload.refresh_token});if(error)throw error;
}
