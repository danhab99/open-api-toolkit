import React from "react";

export type FrameProps = {
  header?: React.ReactNode;
};

export function Frame(props: React.PropsWithChildren<FrameProps>) {
  return (
    <>
      <main className="px-20 pt-8">
        <div className="flex flex-row gap-8">
          <h1 className="text-4xl">OpenAPI Connector</h1>
          {props.header}
        </div>

        <div className="py-8">{props.children}</div>
      </main>
    </>
  );
}
