'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '../layouts/MainLayout';
import { showToast } from '@/utils/toast';
import { authService } from '@/api/services/service';
import { User } from '@/api/types/auth.types';
import Cookies from 'js-cookie';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        pronouns: '',
        email: '',
        phone: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            router.push('/login?from=/profile');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await authService.getProfile();
                console.log(response.data)
                if (response && response.success) {
                    setUser(response.data);
                    setFormData({
                        firstName: response.data.firstName || '',
                        lastName: response.data.lastName || '',
                        pronouns: response.data.pronouns || '',
                        email: response.data.email || '',
                        phone: response.data.phone || '',
                    });
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                showToast.error('Failed to load profile data');
            }
        };

        fetchProfile();
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !user._id) {
            showToast.error('User data is not fully loaded or missing ID. Please try again.');
            setIsLoading(false); // Ensure loading state is turned off
            return;
        }
        setIsLoading(true);
        try {
            const dataToUpdate: Partial<User> = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email:formData.email,
                pronouns: formData.pronouns,
                phone: formData.phone,
            };
            console.log(user._id)
            const response = await authService.updateProfile(dataToUpdate, user._id);
            if (response && response.success) {
                setUser(response.user);
                showToast.success('Profile updated successfully');
                setIsEditing(false);
                localStorage.setItem('user', JSON.stringify(response.user));
                
                try {
                    const refreshResponse = await authService.refreshToken();
                    if (refreshResponse && refreshResponse.success) {
                        localStorage.setItem('authToken', refreshResponse.data);
                        Cookies.set('authToken', refreshResponse.authToken, { expires: 7 });
                    }
                } catch (error) {
                    console.error('Failed to refresh token:', error);
                }
            } else {
                showToast.error(response.message || 'Failed to update profile');
            }
        } catch (error: any) {
            showToast.error(error.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8 mt-20">
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                            <h1 className="text-2xl font-bold text-primary">{isEditing ? 'Update Profile' : 'Profile Details'}</h1>
                            {!isEditing && user && (
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary transition-colors "
                                >
                                    Update Profile
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full appearance-none px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full appearance-none px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1]"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full appearance-none px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1] bg-gray-100"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full appearance-none px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Pronouns</label>
                                    <input
                                        type="text"
                                        name="pronouns"
                                        value={formData.pronouns}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full appearance-none px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1]"
                                    />
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            // Reset form data to user data if canceled
                                            if (user) {
                                                setFormData({
                                                    firstName: user.firstName || '',
                                                    lastName: user.lastName || '',
                                                    pronouns: user.pronouns || '',
                                                    email: user.email || '',
                                                    phone: user.phone || '',
                                                });
                                            }
                                        }}
                                        className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-6 py-2 bg-secondary text-white rounded-md hover:bg-primary transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? 'Updating...' : 'Update Profile'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">First Name</h3>
                                        <p className="mt-1 text-lg text-gray-900">{user?.firstName || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
                                        <p className="mt-1 text-lg text-gray-900">{user?.lastName || 'Not set'}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                                        <p className="mt-1 text-lg text-gray-900">{user?.email || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                                        <p className="mt-1 text-lg text-gray-900">{user?.phone || 'Not set'}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Pronouns</h3>
                                    <p className="mt-1 text-lg text-gray-900">{user?.pronouns || 'Not set'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
} 