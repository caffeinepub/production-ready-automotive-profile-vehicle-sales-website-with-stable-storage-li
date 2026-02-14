import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export interface Promotion {
    id: bigint;
    terms: string;
    title: string;
    published: boolean;
    description: string;
    imageUrl: string;
    validUntil: string;
}
export interface BlogPost {
    id: bigint;
    title: string;
    content: string;
    seoTitle: string;
    views: bigint;
    publishDate: string;
    published: boolean;
    author: string;
    likes: bigint;
    imageUrl: string;
    seoDescription: string;
}
export interface MediaAsset {
    id: bigint;
    typ: string;
    url: string;
    size: bigint;
    folder: string;
}
export interface CreditSimulation {
    tenor?: bigint;
    downPayment?: number;
    date: string;
    name: string;
    unit: string;
    email: string;
    message: string;
    address: string;
    notes?: string;
    phoneNumber: string;
}
export interface Variant {
    features: Array<string>;
    isPremium: boolean;
    name: string;
    priceAdjustment: bigint;
}
export interface Contact {
    tenor?: bigint;
    downPayment?: number;
    date: string;
    name: string;
    unit: string;
    email: string;
    message: string;
    address: string;
    notes?: string;
    phoneNumber: string;
}
export interface VisitorStats {
    activeUsers: bigint;
    todayTraffic: bigint;
    totalVisitors: bigint;
    pageViews: bigint;
}
export interface Vehicle {
    id: bigint;
    commercialFeatures?: CommercialVehicleFeatures;
    brochure: string;
    published: boolean;
    name: string;
    description: string;
    variants: Array<Variant>;
    specs: TechnicalSpecs;
    imageUrl: string;
    price: bigint;
    videoUrl?: string;
    isCommercial: boolean;
}
export interface CommercialVehicleFeatures {
    bus: boolean;
    sixByTwo: boolean;
    speed: boolean;
    economical: boolean;
    fourByTwo: boolean;
    capacity: boolean;
    power: boolean;
    sixByFour: boolean;
}
export interface TechnicalSpecs {
    weight: string;
    additionalFeatures: Array<string>;
    fuelCapacity: string;
    transmission: string;
    suspension: string;
    dimensions: string;
    engine: string;
}
export interface Interaction {
    itemId: bigint;
    sharesFacebook: bigint;
    shares: bigint;
    sharesTwitter: bigint;
    likes: bigint;
    sharesWhatsApp: bigint;
}
export interface Testimonial {
    id: bigint;
    customerName: string;
    review: string;
    city: string;
    published: boolean;
    imageUrl: string;
    rating: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addContact(contact: Contact): Promise<void>;
    addCreditSimulation(simulation: CreditSimulation): Promise<void>;
    adminLogin(email: string, password: string): Promise<{
        token: string;
        role: string;
    } | null>;
    adminLogout(token: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAdminUser(email: string, password: string, role: string): Promise<bigint | null>;
    createBlogPost(sessionToken: string, post: BlogPost): Promise<void>;
    createMediaAsset(sessionToken: string, asset: MediaAsset): Promise<void>;
    createPromotion(sessionToken: string, promotion: Promotion): Promise<void>;
    createTestimonial(sessionToken: string, testimonial: Testimonial): Promise<void>;
    createVehicle(sessionToken: string, vehicle: Vehicle): Promise<void>;
    deleteBlogPost(sessionToken: string, id: bigint): Promise<void>;
    deleteContact(sessionToken: string, id: bigint): Promise<void>;
    deleteCreditSimulation(sessionToken: string, id: bigint): Promise<void>;
    deleteMediaAsset(sessionToken: string, id: bigint): Promise<void>;
    deletePromotion(sessionToken: string, id: bigint): Promise<void>;
    deleteTestimonial(sessionToken: string, id: bigint): Promise<void>;
    deleteVehicle(sessionToken: string, id: bigint): Promise<void>;
    getBlogPost(id: bigint): Promise<BlogPost | null>;
    getBlogPosts(): Promise<Array<BlogPost>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContacts(sessionToken: string): Promise<Array<Contact>>;
    getCreditSimulations(sessionToken: string): Promise<Array<CreditSimulation>>;
    getMediaAssets(sessionToken: string): Promise<Array<MediaAsset>>;
    getProductInteraction(itemId: bigint): Promise<Interaction | null>;
    getPromotion(id: bigint): Promise<Promotion | null>;
    getPromotions(): Promise<Array<Promotion>>;
    getTestimonials(): Promise<Array<Testimonial>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVehicle(id: bigint): Promise<Vehicle | null>;
    getVehicles(): Promise<Array<Vehicle>>;
    getVisitorStats(sessionToken: string): Promise<VisitorStats>;
    incrementPageView(): Promise<void>;
    incrementVisitor(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    likeProduct(itemId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    shareProduct(itemId: bigint, platform: string): Promise<void>;
    updateBlogPost(sessionToken: string, post: BlogPost): Promise<void>;
    updatePromotion(sessionToken: string, promotion: Promotion): Promise<void>;
    updateTestimonial(sessionToken: string, testimonial: Testimonial): Promise<void>;
    updateVehicle(sessionToken: string, vehicle: Vehicle): Promise<void>;
    updateVisitorStats(sessionToken: string, stats: VisitorStats): Promise<void>;
}
