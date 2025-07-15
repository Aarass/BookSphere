import { useParams } from "react-router";

export function Room() {
  let { id: clubId, roomId } = useParams();

  if (!clubId || !roomId) throw "Developer error";

  return <></>;
}
