export class User {
  public id: number = NaN;
  public name: string = "";
  public email?: string | null;
  public type?: string | null;
  public image?: string | null;

  constructor(props: Omit<User, "id">, id?: number) {
    Object.assign(this, props);

    if (id) {
      this.id = id;
    }
  }
}
