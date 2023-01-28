import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";
import { votes } from "@prisma/client";
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (session) {
    res.status(200).json({ user: session.user });
  } else {
    res.status(401).json({ error: "Not authorized" });
  }

  const { code } = req.query;

  //get detail by code

  if (req.method === "GET") {
    const result = await prisma?.votes.findFirst({
      select: {
        id: true,
        code: true,
        title: true,
        startDate: true,
        endDate: true,
        candidates: true,
        publisher: true,
        deleteAt: true,
        createdAt: true,
      },
      where: {
        code: code as string,
        deleteAt: undefined,
      },
    });

    if (!result) return res.status(404).json({ message: "not found" });

    const response: Res<votes> = {
      success: true,
      message: "success",
      status: 200,
      data: result,
    };
    return res.json(response);
  }

  //delete by code
  if (req.method === "DELETE") {
    //delete
    const result = await prisma?.votes.update({
      where: {
        code: code as string,
      },
      data: {
        deleteAt: new Date().toString(),
      },
    });

    res.status(200).json({ result });
  }

  //update by code
  if (req.method === "PUT") {
    const { title, startDate, endDate, candidates } = req.body;

    const result = await prisma?.votes.update({
      where: {
        code: code as string,
      },
      data: {
        title,
        startDate,
        endDate,
        candidates,
      },
    });

    res.status(200).json({ result });
  }
}
