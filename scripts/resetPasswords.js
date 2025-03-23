import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();

const reset = async () => {
  const users = await prisma.user.findMany();

  for (const user of users) {
    const plainPassword = '1111xY11'; // tu zmeň na tvoje heslo
    const hashed = await bcrypt.hash(plainPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    console.log(`✅ Updated password for user ${user.email}`);
  }

  console.log('✅ All passwords updated.');
  process.exit(0);
};

reset().catch(e => {
  console.error('❌ Error updating passwords:', e);
  process.exit(1);
});
