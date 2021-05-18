import { mongoose } from '@mono-pnpm-temple-pkg/modules';
import { mongoTransaction } from '@mono-pnpm-temple-pkg/toolbox';
const userSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: String,
  password: String,
  email: String,
  company: String,
  phone: String,
  createAt: Date,
  lines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Line', default: [] }],
});

const userModel = mongoose.model('User', userSchema);

mongoose.connection.on('open', function () {
  userModel.createCollection();
});

userSchema.statics.createIfEmailNotExist = async function ({ user, session = null }) {
  const init = async session => {
    const [newUser] = await this.create([user], { session });
    return newUser;
  };

  return session ? init(session) : mongoTransaction(init);
};
export const User = userModel;
