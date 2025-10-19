import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/firebase';
import 'dotenv/config';
import { User } from '../types'; //  1. Import User type

const usersCollection = db.collection('users');

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  try {
    const userExists = await usersCollection.where('email', '==', email).get();
    if (!userExists.empty) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = { email, password: hashedPassword };
    const userRef = await usersCollection.add(newUser);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data() as Omit<User, 'id'>; // 👈 2. กำหนด Type ให้ข้อมูลที่ได้
      res.status(201).json({
        _id: userDoc.id,
        email: userData.email,
        token: generateToken(userDoc.id),
      });
    } else {
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(400).json({ message: 'User registration failed' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const snapshot = await usersCollection.where('email', '==', email).get();
    if (snapshot.empty) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const userDoc = snapshot.docs[0];
    //  3. กำหนด Type ให้กับ user object โดยใช้ "as User"
    const user = { id: userDoc.id, ...userDoc.data() } as User;

    //  4. เพิ่มการตรวจสอบ user.password ก่อนใช้งาน
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};