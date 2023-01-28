import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../lib/prisma";

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

  //add participant
  if (req.method === "POST") {
    const participant = await prisma.participant.create({
      data: {
        email: session?.user?.email!,
        code: code as string,
        candidate: req.body.candidate,
      },
    });
    res.json(participant);
  }

  //get participant
  if (req.method === "GET") {
    const participant = await prisma.participant.findFirst({
      where: {
        email: session?.user?.email!,
        code: code as string,
      },
    });
    const response = {
      status: 200,
      data: participant,
    };
    res.json(response);
  }
}
