/** Legacy records are reserved for the original site owner, never the first public registrant. */
export function canClaimLegacy(id:string,provider:string,email:string,configuredOwnerEmail?:string){
 if(provider==='local')return id==='local-owner';
 return provider==='chatgpt'&&!!configuredOwnerEmail&&email.trim().toLowerCase()===configuredOwnerEmail.trim().toLowerCase();
}
