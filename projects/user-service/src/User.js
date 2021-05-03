import { mongoose } from '@mono-pnpm-temple/toolbox';

const UserSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: String,
  password: String,
  email: String,
  company: String,
  phone: String,
  createAt: Date,
  lines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Line', default: [] }],
});

const userModel = mongoose.model('User', UserSchema);

mongoose.connection.on("open", function () {
  userModel.createCollection();
});

UserSchema.statics.createIfEmailNotExist = async function ({ user, session = null }) {
  const init = async session => {
    const [newUser] = await this.create([user], { session });

    return session ? init(session) : mongoTransaction(init);
  };
}

export const User = userModel;
