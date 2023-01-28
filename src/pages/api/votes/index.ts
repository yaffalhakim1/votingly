import { votes } from "@prisma/client";
import { code } from "@/lib/code";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) return res.status(404).json({ error: "Unauthorized User" });

  //   const { id } = req.query;

  //   const vote = await fetch(`https://api.votingly.com/vote/${id}`);

  //   const voteData = await vote.json();

  //create new
  if (req.method === "POST") {
    const result = await prisma.votes.create({
      data: {
        title: req.body.title,
        candidates: req.body.candidates,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        publisher: req.body.publisher,
        deleteAt: req.body.deleteAt,
        code: code(6),
      },
    });
    return res.status(200).json(result);
  }

  //get all by user
  if (req.method === "GET") {
    const result = await prisma.votes.findMany({
      where: {
        AND: [{ publisher: session?.user?.email! }, { deleteAt: undefined }],
      },
    });
    const response = {
      success: true,
      message: "success",
      status: 200,
      data: result,
    };
    return res.status(200).json(response);
  }
  return res.status(200).json({ data: "hai" });
}
