import { Request, Response } from "express";

const index = (req: Request, res: Response) => {
  res.render("index");
};

export default { index };
