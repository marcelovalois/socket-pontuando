export class Phrase {
  public id?: number;
  public text: string = "";
  public order?: number | null;
  public activity_id: number = NaN;

  constructor(props: Omit<Phrase, "id">, id?: number) {
    Object.assign(this, props);

    if (id) {
      this.id = id;
    }
  }
}
