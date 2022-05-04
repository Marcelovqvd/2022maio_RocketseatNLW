import { Router } from 'express'
import { prisma } from './prisma'
import nodemailer from 'nodemailer'

export const routes = Router()

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "295cd84c74ec87",
    pass: "3d2511be1006cb"
  }
});

routes.post('/feedbacks', async (req, res) => {
  const { type, comment, screenshot } = req.body

  const feedback = await prisma.feedback.create({
    data: {
      type,
      comment,
      screenshot
    }
  })

  await transport.sendMail({
    from: 'Equipe feedget <oi@feedback.com>',
    to: 'Marcelo <marcelovqvd@gmail.com>',
    subject: 'Novo feedback',
    html: [
      `<div style="font-family: sans-serif; font-size: 16px; color: #111;">`,
      `<p>Tipo do feedback: ${type}</p>`,
      `<p>Comentário: ${comment}</p>`,
      `<div>`
    ].join('\n')
  })

  return res.status(201).json({data: feedback})
})