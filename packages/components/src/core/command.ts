export const parseCommand = (command: string) => {
  if (!command.startsWith("--")) {
    throw new Error("Invalid command " + command);
  }

  // --command:arg1=value1;arg2=value2
  const [commandName, argString] = command.substring(2).split(":");

  const argValues: Record<string, string> = {};
  if (argString) {
    for (const pair of argString.split(";")) {
      const [argName, argValue] = pair.split("=");
      argValues[argName] = argValue;
    }
  }

  return {
    name: commandName,
    args: argValues,
  };
};
