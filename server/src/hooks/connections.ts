"use client";

import { use } from "react";

import { getMyConnection, getMyConnections } from "../lib/connection";
import { ID } from "@/types";

export function useMyConnections() {
  return use(getMyConnections());
}

export function useMyConnection(id: ID) {
  return use(getMyConnection(id));
}
