import type { IBaseElement } from "../IBaseElement";
import { isNodeElement } from "./INodeElement";

export const getParentObject = (element: IBaseElement) => {
  let ancestor = element.getAncestor();

  while (ancestor && !isNodeElement(ancestor)) {
    ancestor = ancestor.getAncestor();
  }

  return ancestor;
};

export const getCommandInvocationInfo = (element: IBaseElement) => {
  const command = element.getAttribute("command");
  const commandFor = element.getAttribute("commandfor");
  const commandForTarget = commandFor
    ? element.ownerDocument.getElementById(commandFor)
    : null;

  return {
    command,
    commandForTarget,
  };
};

export const invokeCommandOnTarget = (element: IBaseElement) => {
  const { command, commandForTarget } = getCommandInvocationInfo(element);

  if (command && commandForTarget) {
    commandForTarget.dispatchEvent(
      new CommandEvent("command", { command, source: element })
    );

    return true;
  }

  return false;
};
