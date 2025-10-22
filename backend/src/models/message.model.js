// This model is now managed by Prisma and PostgreSQL.
// Use Prisma client for all message DB operations.
// Add a Message model to prisma/schema.prisma if not present.

// Example Prisma model definition (to be added to prisma/schema.prisma):
/*
model Message {
  id        String   @id @default(cuid())
  sender    User     @relation(fields: [senderId], references: [id])
  senderId  String
  receiver  User     @relation(fields: [receiverId], references: [id])
  receiverId String
  content   String
  roomId    String?  @relation(fields: [roomId], references: [id])
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
*/
