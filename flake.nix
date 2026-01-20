{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachSystem flake-utils.lib.defaultSystems (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };

        # Just list the project directories
        projectPaths = [
          ./server
          # ./connections/google
          # ./prisma
        ];

        # Turn each project path into a nodeDeps derivation
        nodeDeps = map (projPath:
          let
            pkgJson = builtins.fromJSON (builtins.readFile (projPath + "/package.json"));
          in
            pkgs.mkYarnPackage {
              pname = "${pkgJson.name}-deps";
              version = pkgJson.version or "1.0.0";
              src = projPath;
              packageJSON = projPath + "/package.json";
              yarnLock   = projPath + "/yarn.lock";
              # optional: add yarnNix = projPath + "/yarn.nix"; if you pre-generate one
            }
        ) projectPaths;

        # Join all node_modules into a single NODE_PATH
        nodePath = pkgs.lib.concatStringsSep ":" (map (nd: "${nd}/lib/node_modules") nodeDeps);

      in {
        devShells = {
          default = pkgs.mkShell {
            packages = with pkgs; [
              gnumake
              nodejs_22
              yarn
              prettierd
            ];

            # Prisma engines
            PRISMA_QUERY_ENGINE_LIBRARY =
              "${pkgs.prisma-engines}/lib/libquery_engine.node";
            PRISMA_QUERY_ENGINE_BINARY =
              "${pkgs.prisma-engines}/bin/query-engine";
            PRISMA_SCHEMA_ENGINE_BINARY =
              "${pkgs.prisma-engines}/bin/schema-engine";

            # All node_modules from projects
            NODE_PATH = nodePath;

            # Database path
            DATABASE_PATH = "file:/home/dan/Documents/node/mcp-server/db";

            shellHook = ''
              export DATABASE_PATH="file:$(dirname $(realpath $(git rev-parse --git-dir)))/db"
              zsh
            '';
          };
        };
      });
}
