export class Courses implements ICourses {
  Name: string = "";
  studentId: any = [];
  colaborationId: any = [];
  curs: any = [];
  constructor(courses: ICourses) {
    this.Name = courses.Name;
    this.studentId = courses.studentId;
    this.colaborationId = courses.colaborationId;
    this.curs = courses.curs;
  }
  public async newCourse() {
    const req = await fetch("http://localhost:3000/curs/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie:
          "id=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTM4ZjQzMTQ5MmRjZGM3NWUwYTFmYWEiLCJpYXQiOjE2OTg0MTcwMzQsImV4cCI6MTY5ODUwMzQzNH0.Knmayy5Aehxop2Ie87cAib7EOVxaus8A4TZ6ySerxNU",
      },
      credentials: 'include', // Include this line
      body: JSON.stringify(this)
    });
    return req.json();
  }

}
