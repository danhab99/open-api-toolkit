import { ConfigInput } from "@/components/ConfigInput";
import { importConnection, Connections } from "@/lib/connection";

type PageProps = {
  connectionName: string;
};

export default async function Page(p: Promise<PageProps>) {
  const props = await p;
  const connection = importConnection(props.connectionName);

  return (
    <div>
      {connection.configurationArguments.map((arg, i) => (
        <ConfigInput key={i} config={arg} />
      ))}
    </div>
  );
}

export async function generateStaticParams() {
  return Connections.map((slug) => ({ slug }));
}
