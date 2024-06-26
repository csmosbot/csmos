"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createUrl } from "@/lib/url";
import type { Command, RegistryEntry, SubcommandWithOptions } from "@/registry";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ChangeEventHandler, useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function AllCommands({ registry }: { registry: RegistryEntry[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentTab, setCurrentTab] = useState<string | undefined>(
    searchParams.get("category") ?? undefined,
  );
  const [searchValue, setSearchValue] = useState<string>(
    searchParams.get("query") ?? "",
  );

  function setValue(value: string) {
    const newParams = new URLSearchParams(searchParams.toString());
    if (value !== "all") newParams.set("category", value);
    else newParams.delete("category");

    setCurrentTab(value);
    router.replace(createUrl(pathname, newParams), { scroll: false });
  }

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (ev) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (ev.target.value.length) newParams.set("query", ev.target.value);
    else newParams.delete("query");

    setSearchValue(ev.target.value);
    router.replace(createUrl(pathname, newParams), { scroll: false });
  };

  return (
    <Tabs
      defaultValue="all"
      className="pt-3"
      value={currentTab}
      onValueChange={setValue}
    >
      <div className="flex flex-col items-center gap-1 min-[958px]:flex-row min-[958px]:gap-2">
        <ScrollArea className="w-full rounded-lg">
          <TabsList className="mb-1 w-full justify-start gap-1">
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
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <Input
          placeholder="Search for a command..."
          value={searchValue}
          onChange={onInputChange}
        />
      </div>
      <CommandList
        name="All"
        commands={registry
          .map((category) => category.commands)
          .flat(1)
          .sort((a, b) => a.name.localeCompare(b.name))}
        searchValue={searchValue}
      />
      {registry.map((category) => (
        <CommandList
          key={category.name}
          name={category.name}
          commands={category.commands}
          searchValue={searchValue}
        />
      ))}
    </Tabs>
  );
}

function CommandList({
  name,
  commands,
  searchValue,
}: {
  name: string;
  commands: Command[];
  searchValue: string;
}) {
  const filteredCommands = commands.filter((command) =>
    command.name.toLowerCase().startsWith(searchValue.toLowerCase()),
  );

  return (
    <TabsContent value={name.toLowerCase()}>
      {filteredCommands.length ? (
        <ul className="flex flex-col gap-3">
          {filteredCommands.map((command) => (
            <li key={command.name}>
              <Card>
                <CardHeader>
                  <CardTitle>/{command.name}</CardTitle>
                  <CardDescription>{command.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6 [&:empty]:hidden">
                  {"options" in command && (
                    <div>
                      <p className="pb-2 font-medium">Options</p>
                      <ul className="flex flex-col gap-2">
                        {command.options.map((option) => (
                          <li
                            key={option.name}
                            className="flex items-center gap-1.5 text-sm"
                          >
                            <p className="font-medium">{option.name}</p>
                            <p className="text-muted-foreground">
                              {option.description}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {"subcommands" in command && (
                    <div>
                      <p className="pb-2 font-medium">Subcommands</p>
                      <ul className="flex flex-col gap-2">
                        {command.subcommands.map((subcommand) => (
                          <li
                            key={subcommand.name}
                            className="flex flex-col gap-1.5"
                          >
                            <div className="flex items-center gap-1.5 text-sm">
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
                                      className="flex flex-col gap-1.5"
                                    >
                                      <div className="flex items-center gap-1.5 pl-2 text-sm">
                                        <p className="font-medium">
                                          {subcommand.name}
                                        </p>
                                        <p className="text-muted-foreground">
                                          {subcommand.description}
                                        </p>
                                      </div>
                                      {"options" in subcommand &&
                                        !!(subcommand as SubcommandWithOptions)
                                          .options.length && (
                                          <div className="pl-4">
                                            <p className="pb-2 font-medium">
                                              Options
                                            </p>
                                            <ul className="flex flex-col gap-2">
                                              {(
                                                subcommand as SubcommandWithOptions
                                              ).options.map((option) => (
                                                <li
                                                  key={option.name}
                                                  className="flex items-center gap-1.5 text-sm"
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
                                  {"options" in subcommand &&
                                    !!(subcommand as SubcommandWithOptions)
                                      .options.length && (
                                      <div className="pl-4">
                                        <p className="pb-2 font-medium">
                                          Options
                                        </p>
                                        <ul className="flex flex-col gap-2">
                                          {(
                                            subcommand as SubcommandWithOptions
                                          ).options.map((option) => (
                                            <li
                                              key={option.name}
                                              className="flex items-center gap-1.5 text-sm"
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
                                  <p className="pb-2 font-medium">Options</p>
                                  <ul className="flex flex-col gap-2">
                                    {subcommand.options.map((option) => (
                                      <li
                                        key={option.name}
                                        className="flex items-center gap-1.5 text-sm"
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
                    </div>
                  )}
                  {command.permissions && (
                    <div>
                      <p className="pb-2 font-medium">Permissions</p>
                      <ul className="flex flex-col gap-2">
                        {command.permissions.map((permission) => (
                          <li
                            key={permission}
                            className="flex items-center gap-1.5 text-sm"
                          >
                            {permission}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center gap-0.5 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            No commands found
          </h1>
          <p className="text-sm text-muted-foreground">
            Try a different search term
          </p>
        </div>
      )}
    </TabsContent>
  );
}
