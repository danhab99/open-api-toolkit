"use server";
import {
  getAllConnections,
  getTools,
  importConnection,
} from "@/lib/connection";
import { Frame } from "@/components/Frame";
import { CreateConnection } from "@/components/CreateConnection";

type PageProps = {
  params: Promise<{
    connectionName: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const props = await params;
  const connection = await importConnection(props.connectionName);
  const tools = await getTools(connection.id);

  return (
    <Frame title={`create ${connection.displayName.toLowerCase()} connection`}>
      <hr />
      <h1 className="text-2xl py-2">
        {connection.displayName} ({connection.id})
      </h1>
      <p className="text-gray-500 pb-4">{connection.userDescription}</p>
      <div className="flex flex-row">
        <div className="w-3/5">
          <CreateConnection connectionDef={connection} />
        </div>
        <div className="w-2/5">
          <h3 className="text-xl pl-4">Tools</h3>
          {tools.map((tool, i) => (
            <div
              key={i}
              className="border border-gray-100 rounded-lg p-4 shadow ml-4 my-4"
            >
              <h6 className="text-gray-500 leading-none overflow-none text-ellipsis align-middle pb-2">
                {tool.displayName}
                {" "}
                <span className="text-xs pb-2 text-gray-600">({tool.id})</span>
              </h6>
              <p className="text-xs">{tool.userDescription}</p>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

export async function generateStaticParams() {
  const c = await getAllConnections();
  return c.map((slug) => ({ slug }));
}
