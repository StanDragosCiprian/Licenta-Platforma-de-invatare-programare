import { getFromServerCookie, urlBackend } from "../UserServer/ServerRequest";

export class HandleProfessor {
  private cookiesId: string | undefined;
  constructor(id: string | undefined) {
    this.cookiesId = id;
  }
  async getProfessorName() {
    const professor = await fetch(
      `${urlBackend}courses/professorName`,
      getFromServerCookie(this.cookiesId)
    );
    return await professor.text();
  }
  async isProfessor() {
    const professor = await fetch(
      `${urlBackend}professor/isProfessor`,
      getFromServerCookie(this.cookiesId)
    );
    return await professor.text();
  }
}
