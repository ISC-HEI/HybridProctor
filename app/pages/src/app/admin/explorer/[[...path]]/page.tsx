
import Explorer from "./explorer";


function getPath({ path }: { path: string[]|undefined }) {
  if (path === undefined) {
    return;
  }

  return path.join("/");
}

export default async function Page(
  { params }: { params: Promise<{ path: string[]|undefined }> }
) {
  const path = getPath(await params);

  return (
    <Explorer path={path !== undefined ? decodeURIComponent(path) : path} />
  )
}
