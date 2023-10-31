import * as Hapi from "@hapi/hapi";
export interface ICreateAchievement extends Hapi.Request {
  params: {
    name: string;
    description: string;
    goal: number;
    type: string;
    image:string;
  };
}
