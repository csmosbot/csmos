import { type Command, getRegistry, SubcommandWithOptions } from "@/registry";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Commands() {
  const registry = await getRegistry();
  return (
    <div className="container py-6">
      <h1 className="text-4xl font-bold tracking-tight">Commands</h1>
      <p className="text-sm text-muted-foreground pt-1">
        View a list of every single one of csmos' commands.
      </p>
      <Tabs defaultValue="all" className="pt-3">
        <TabsList className="gap-1 mb-1">
          <TabsTrigger value="all" className="hover:bg-foreground/10">
            All
          </TabsTrigger>
          {registry.map((category) => (
            <TabsTrigger
              key={category.name}
              value={category.name.toLowerCase()}
              className="hover:bg-foreground/10"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <CommandList
          name="All"
          commands={registry
            .map((category) => category.commands)
            .flat(1)
            .sort((a, b) => a.name.localeCompare(b.name))}
        />
        {registry.map((category) => (
          <CommandList
            key={category.name}
            name={category.name}
            commands={category.commands}
          />
        ))}
      </Tabs>
    </div>
  );
}

function CommandList({
  name,
  commands,
}: {
  name: string;
  commands: Command[];
}) {
  return (
    <TabsContent value={name.toLowerCase()}>
      <ul className="flex flex-col gap-3">
        {commands.map((command) => (
          <li key={command.name}>
            <Card>
              <CardHeader>
                <CardTitle>/{command.name}</CardTitle>
                <CardDescription>{command.description}</CardDescription>
              </CardHeader>
              <CardContent className="[&:empty]:hidden">
                {"options" in command && (
                  <>
                    <p className="font-medium pb-1">Options</p>
                    <ul className="flex flex-col gap-1">
                      {command.options.map((option) => (
                        <li
                          key={option.name}
                          className="text-sm flex items-center gap-1.5"
                        >
                          <p className="font-medium">{option.name}</p>
                          <p className="text-muted-foreground">
                            {option.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {"subcommands" in command && (
                  <>
                    <p className="font-medium pb-1">Subcommands</p>
                    <ul className="flex flex-col gap-2">
                      {command.subcommands.map((subcommand) => (
                        <li
                          key={subcommand.name}
                          className="flex flex-col gap-1.5"
                        >
                          <div className="text-sm flex items-center gap-1.5">
                            <p className="font-medium">{subcommand.name}</p>
                            <p className="text-muted-foreground">
                              {subcommand.description}
                            </p>
                          </div>
                          {"subcommands" in subcommand &&
                            !!subcommand.subcommands.length && (
                              <ul className="flex flex-col gap-1">
                                {subcommand.subcommands.map((subcommand) => (
                                  <li
                                    key={subcommand.name}
                                    className="text-sm flex items-center gap-1.5 pl-2"
                                  >
                                    <p className="font-medium">
                                      {subcommand.name}
                                    </p>
                                    <p className="text-muted-foreground">
                                      {subcommand.description}
                                    </p>
                                  </li>
                                ))}
                                {"options" in subcommand &&
                                  !!(subcommand as SubcommandWithOptions)
                                    .options.length && (
                                    <div className="pl-4">
                                      <p className="font-medium pb-1">
                                        Options
                                      </p>
                                      <ul className="flex flex-col gap-1">
                                        {(
                                          subcommand as SubcommandWithOptions
                                        ).options.map((option) => (
                                          <li
                                            key={option.name}
                                            className="text-sm flex items-center gap-1.5"
                                          >
                                            <p className="font-medium">
                                              {option.name}
                                            </p>
                                            <p className="text-muted-foreground">
                                              {option.description}
                                            </p>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                              </ul>
                            )}
                          {"options" in subcommand &&
                            !!subcommand.options.length && (
                              <div className="pl-2">
                                <p className="font-medium pb-1">Options</p>
                                <ul className="flex flex-col gap-1">
                                  {subcommand.options.map((option) => (
                                    <li
                                      key={option.name}
                                      className="text-sm flex items-center gap-1.5"
                                    >
                                      <p className="font-medium">
                                        {option.name}
                                      </p>
                                      <p className="text-muted-foreground">
                                        {option.description}
                                      </p>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </TabsContent>
  );
}
