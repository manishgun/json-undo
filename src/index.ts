type Patch = { [key: string]: any };

class JSONChangesTracker {
  private history: { patch: Patch; prevJson: Record<string, any> }[] = [];
  private future: { patch: Patch; prevJson: Record<string, any> }[] = [];
  private currentJson: Record<string, any>;

  constructor(initialJson: Record<string, any> = {}) {
    this.currentJson = this.deepClone(initialJson);
  }

  update(newJson: Record<string, any>): void {
    const patch = this.createPatch(this.currentJson, this.deepClone(newJson));

    if (Object.keys(patch).length > 0) {
      this.future = [];
      this.history.push({ patch, prevJson: this.deepClone(this.currentJson) });
      this.currentJson = this.deepClone(newJson);
    }
  }

  private createPatch(oldJson: Record<string, any>, newJson: Record<string, any>): Patch {
    const patch: Patch = {};

    for (const key in newJson) {
      if (JSON.stringify(newJson[key]) !== JSON.stringify(oldJson[key])) {
        patch[key] = newJson[key];
      }
    }

    for (const key in oldJson) {
      if (!(key in newJson)) {
        patch[key] = null;
      }
    }

    return patch;
  }

  undo(): Record<string, any> {
    if (this.canUndo()) {
      const lastChange = this.history.pop()!;
      this.future.push({ patch: lastChange.patch, prevJson: this.deepClone(this.currentJson) });
      this.currentJson = this.deepClone(lastChange.prevJson);
    }
    return this.currentJson;
  }

  redo(): Record<string, any> {
    if (this.canRedo()) {
      const nextChange = this.future.pop()!;
      this.history.push({ patch: nextChange.patch, prevJson: this.deepClone(this.currentJson) });
      this.applyPatch(nextChange.patch);
    }
    return this.currentJson;
  }

  private applyPatch(patch: Patch): void {
    for (const key in patch) {
      if (patch[key] === null) {
        delete this.currentJson[key];
      } else {
        this.currentJson[key] = patch[key];
      }
    }
  }

  get(): Record<string, any> {
    return this.deepClone(this.currentJson);
  }

  canUndo(): boolean {
    return this.history.length > 0;
  }

  canRedo(): boolean {
    return this.future.length > 0;
  }

  private deepClone(obj: Record<string, any>): Record<string, any> {
    return JSON.parse(JSON.stringify(obj));
  }
}

export default JSONChangesTracker;
