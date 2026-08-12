/** Compare two explicit ISO-8601 ranges without inferring missing boundaries. */
export function rangesOverlap(first,second){
  if(!first?.start||!first?.end||!second?.start||!second?.end)return undefined;
  return new Date(first.start)<=new Date(second.end)&&new Date(second.start)<=new Date(first.end);
}
