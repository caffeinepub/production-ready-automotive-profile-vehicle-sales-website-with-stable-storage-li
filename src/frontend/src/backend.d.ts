import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export type Time = bigint;
export interface BlogCommentInput {
    content: string;
    name: string;
    blogPostId: bigint;
    email: string;
    parentId?: bigint;
}
export interface MediaAsset {
    id: bigint;
    typ: string;
    url: string;
    size: bigint;
    folder: string;
}
export interface ExtendedVisitorStats {
    todayTraffic: bigint;
    monthlyTraffic: bigint;
    totalVisitors: bigint;
    yesterdayTraffic: bigint;
    yearlyTraffic: bigint;
    onlineVisitors: bigint;
    pageViews: bigint;
    weeklyTraffic: bigint;
}
export interface Variant {
    features: Array<string>;
    isPremium: boolean;
    name: string;
    priceAdjustment: bigint;
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
export interface SiteBanner {
    id: string;
    updatedAt: Time;
    updatedBy: bigint;
    imageUrl: string;
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
export type BlogPostId = bigint;
export interface BlogComment {
    id: bigint;
    content: string;
    name: string;
    createdAt: Time;
    blogPostId: bigint;
    email: string;
    approved: boolean;
    parentId?: bigint;
}
export interface BlogInteractionSummary {
    sharesCount: bigint;
    commentsCount: bigint;
    likesCount: bigint;
}
export interface Interaction {
    itemId: bigint;
    sharesFacebook: bigint;
    shares: bigint;
    sharesTwitter: bigint;
    likes: bigint;
    sharesWhatsApp: bigint;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
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
    addBlogComment(blogCommentInput: BlogCommentInput): Promise<BlogComment>;
    addContact(contact: Contact): Promise<void>;
    addCreditSimulation(simulation: CreditSimulation): Promise<void>;
    adminLogin(email: string, password: string): Promise<{
        token: string;
        role: string;
    } | null>;
    adminLogout(token: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAdminUser(sessionToken: string, email: string, password: string, role: string): Promise<bigint | null>;
    createBlogPost(sessionToken: string, post: BlogPost): Promise<boolean>;
    createMediaAsset(sessionToken: string, asset: MediaAsset): Promise<boolean>;
    createPromotion(sessionToken: string, promotion: Promotion): Promise<boolean>;
    createTestimonial(sessionToken: string, testimonial: Testimonial): Promise<boolean>;
    createVehicle(sessionToken: string, vehicle: Vehicle): Promise<boolean>;
    deleteBlogComment(sessionToken: string, blogPostId: bigint, commentId: bigint): Promise<void>;
    deleteBlogPost(sessionToken: string, id: bigint): Promise<boolean>;
    deleteContact(sessionToken: string, id: bigint): Promise<void>;
    deleteCreditSimulation(sessionToken: string, id: bigint): Promise<void>;
    deleteMediaAsset(sessionToken: string, id: bigint): Promise<boolean>;
    deletePromotion(sessionToken: string, id: bigint): Promise<boolean>;
    deleteTestimonial(sessionToken: string, id: bigint): Promise<boolean>;
    deleteVehicle(sessionToken: string, id: bigint): Promise<boolean>;
    getAdminUserProfile(sessionToken: string, adminUserId: bigint): Promise<UserProfile | null>;
    getAdminUserProfileByIdToken(sessionToken: string, adminUserId: bigint): Promise<UserProfile | null>;
    getAllSiteBanners(sessionToken: string): Promise<Array<SiteBanner>>;
    getAndIncrementBlogPostViews(blogPostId: bigint): Promise<BlogPost | null>;
    getBlogComment(sessionToken: string, blogPostId: bigint, commentId: bigint): Promise<BlogComment | null>;
    getBlogComments(blogPostId: BlogPostId): Promise<Array<BlogComment>>;
    getBlogInteractionSummary(blogPostId: bigint): Promise<BlogInteractionSummary>;
    getBlogPost(id: bigint): Promise<BlogPost | null>;
    getBlogPosts(): Promise<Array<BlogPost>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContacts(sessionToken: string): Promise<Array<Contact> | null>;
    getCreditSimulations(sessionToken: string): Promise<Array<CreditSimulation> | null>;
    getExtendedVisitorStats(sessionToken: string): Promise<ExtendedVisitorStats>;
    getFooterVisitorStats(): Promise<ExtendedVisitorStats>;
    getMediaAssets(sessionToken: string): Promise<Array<MediaAsset> | null>;
    getProductInteraction(itemId: bigint): Promise<Interaction | null>;
    getPromotion(id: bigint): Promise<Promotion | null>;
    getPromotions(): Promise<Array<Promotion>>;
    getSiteBanner(sessionToken: string, id: string): Promise<SiteBanner | null>;
    getTestimonials(): Promise<Array<Testimonial>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVehicle(id: bigint): Promise<Vehicle | null>;
    getVehicles(): Promise<Array<Vehicle>>;
    incrementBlogLike(blogPostId: bigint): Promise<bigint>;
    incrementBlogShare(blogPostId: bigint, _platform: string): Promise<bigint>;
    incrementPageView(): Promise<void>;
    incrementVisitor(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    likeProduct(itemId: bigint): Promise<void>;
    saveAdminUserProfile(sessionToken: string, adminUserId: bigint, profile: UserProfile): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    shareProduct(itemId: bigint, platform: string): Promise<void>;
    updateBlogComment(sessionToken: string, blogPostId: bigint, commentId: bigint, content: string): Promise<void>;
    updateBlogPost(sessionToken: string, post: BlogPost): Promise<boolean>;
    updatePromotion(sessionToken: string, promotion: Promotion): Promise<boolean>;
    updateSiteBanner(sessionToken: string, id: string, imageUrl: string): Promise<boolean>;
    updateTestimonial(sessionToken: string, testimonial: Testimonial): Promise<boolean>;
    updateVehicle(sessionToken: string, vehicle: Vehicle): Promise<boolean>;
    userActivity(sessionId: string): Promise<void>;
}
