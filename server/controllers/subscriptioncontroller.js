// routes/subscription.js
import express from 'express';
import User from '../models/usermodel.js';


export const updateSubscription = async(req, res) => {
    const { clerkId, subscriptionPlan, startDate, endDate } = req.body;
    try {
        const user = await User.findOne({ clerkId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.subscriptionPlan = subscriptionPlan;
        user.subscriptionDetails = {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status: 'active'
        };

        // Clear usage tracking for premium users
        if (subscriptionPlan !== 'Free') {
            user.usage = [];
        }

        await user.save();
        res.status(200).json({
            message: 'Subscription updated successfully',
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getSubscriptionStatus = async(req, res) => {
    const { clerkId } = req.params;

    try {
        const user = await User.findOne({ clerkId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            subscriptionPlan: user.subscriptionPlan,
            subscriptionDetails: user.subscriptionDetails
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}