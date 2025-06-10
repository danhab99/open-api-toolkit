"use server";
import {
  getAllConnections,
  importConnection,
} from "@/lib/connection";
import { Frame } from "@/components/Frame";
import { CreateConnection } from "@/components/CreateConnection";

type PageProps = {
  connectionName: string;
};

export default async function Page({ params }: Promise<PageProps>) {
  const props = await params;
  const connection = await importConnection(props.connectionName);

  return (
    <Frame title={`create ${connection.name.toLowerCase()} connection`}>
      <hr />
      <h1 className="text-2xl py-2">{connection.name}</h1>
      <p className="text-gray-500 pb-4">{connection.userDescription}</p>
      <CreateConnection connectionDef={connection} />
    </Frame>
  );
}

export async function generateStaticParams() {
  const c = await getAllConnections();
  return c.map((slug) => ({ slug }));
}
