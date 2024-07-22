export class HandleGenericFunction {
  static replaceUnderlineWithSpace(text: string): string {
    return text.includes("_") ? text.replace(/_/g, " ") : text;
  }
  static replaceSpaceWithUnderline(text: string): string {
    return text.includes(" ") ? text.replace(/ /g, "_") : text;
  }
}
