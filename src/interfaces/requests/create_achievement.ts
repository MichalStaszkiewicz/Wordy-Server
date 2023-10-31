import * as Hapi from "@hapi/hapi";
export interface ICreateAchievement extends Hapi.Request {
  payload: {
    name: string;
    description: string;
    goal: number;
    type: string;
  };
}
