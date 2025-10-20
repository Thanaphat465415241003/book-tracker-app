import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/firebase';
import 'dotenv/config';
import { User } from '../types';
import { AuthRequest } from '../middleware/authMiddleware';

const usersCollection = db.collection('users');

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response) => {
  // กำหนด Type ให้กับ email และ password ที่ดึงออกมา
  const { email, password }: { email?: string, password?: string } = req.body;

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

    const name = email.split('@')[0];
    const newUser = { name, email, password: hashedPassword };
    const userRef = await usersCollection.add(newUser);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data() as Omit<User, 'id'>;
      res.status(201).json({
        _id: userDoc.id,
        name: userData.name,
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

// 👇 แก้ไขที่ฟังก์ชันนี้ด้วย
export const loginUser = async (req: Request, res: Response) => {
    // กำหนด Type ให้กับ email และ password ที่ดึงออกมา
    const { email, password }: { email?: string, password?: string } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        const snapshot = await usersCollection.where('email', '==', email).get();
        if (snapshot.empty) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const userDoc = snapshot.docs[0];
        const user = { id: userDoc.id, ...userDoc.data() } as User;

        if (user && user.password && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
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

// ฟังก์ชันใหม่: ดึงข้อมูลโปรไฟล์ผู้ใช้
export const getUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userDoc = await usersCollection.doc(req.user.id).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const userProfileData = userDoc.data();

        if (userProfileData) {
            delete userProfileData.password; // ลบรหัสผ่านออกก่อนส่งกลับ
        }

        res.status(200).json({ id: userDoc.id, ...userProfileData });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ฟังก์ชันใหม่: อัปเดตข้อมูลโปรไฟล์ผู้ใช้
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userRef = usersCollection.doc(req.user.id);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // 1. สร้าง Object ว่างสำหรับเก็บข้อมูลที่จะอัปเดต
        const updatedData: { [key: string]: any } = {};
        const { name, phone, bio, birthDate, readingGoal, favoriteGenre, location } = req.body;

        // 2. เช็คและเพิ่มเฉพาะ field ที่มีค่าส่งมา (ไม่ใช่ undefined)
        if (name !== undefined) updatedData.name = name;
        if (phone !== undefined) updatedData.phone = phone;
        if (bio !== undefined) updatedData.bio = bio;
        if (birthDate !== undefined) updatedData.birthDate = birthDate;
        if (readingGoal !== undefined) updatedData.readingGoal = readingGoal;
        if (favoriteGenre !== undefined) updatedData.favoriteGenre = favoriteGenre;
        if (location !== undefined) updatedData.location = location;
        
        // 3. ตรวจสอบว่ามีข้อมูลส่งมาให้อัปเดตหรือไม่
        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({ message: 'No valid data provided for update' });
        }

        // 4. อัปเดตด้วยข้อมูลที่ผ่านการกรองแล้ว
        await userRef.update(updatedData);
        
        const updatedUserDoc = await userRef.get();
        const updatedUserProfileData = updatedUserDoc.data();
        
        if (updatedUserProfileData) {
            delete updatedUserProfileData.password;
        }
        
        res.status(200).json({ id: updatedUserDoc.id, ...updatedUserProfileData });
    } catch (error) {
        console.error("Error updating profile:", error); // Log error จริงๆ ที่ฝั่ง server
        res.status(500).json({ message: 'Server error while updating profile' });
    }
};