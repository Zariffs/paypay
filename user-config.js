/**
 * User Configuration
 * Contains all user profile data, cards, transactions, and settings
 */

const userConfig = {
    // User Profile
    profile: {
        firstName: 'Matt',
        lastName: 'Sutton',
        fullName: 'Matthew A Sutton',
        email: 'zariffsdev@gmail.com',
        phone: '+61 413-385-507',
        memberSince: '2025',
        membershipTier: 'Centurion',
        avatar: null // Could be a URL to profile image
    },

    // Membership Rewards
    rewards: {
        totalPoints: 7922952,
        pointsValue: '$79,229.52', // Approximate cash value
        pendingPoints: 1250,
        tierMultiplier: '5x'
    },

    // Cards
    cards: {
        centurion: {
            id: 'centurion',
            name: 'Centurion Black Card',
            shortName: 'Centurion',
            lastFour: '7838',
            fullNumber: '•••• •••• •••• 7838',
            balance: '$6,847,291.53',
            balanceRaw: 6847291.53,
            image: 'images/AMEX/centurion.jpeg',
            memberSince: '2025',
            creditLimit: '$10,000,000.00',
            creditLimitRaw: 10000000,
            availableCredit: '$3,152,708.47',
            availableCreditRaw: 3152708.47,
            rewardsPoints: 847291,
            apr: '19.99%',
            nextPaymentDue: 'Jan 15, 2026',
            minimumPayment: '$25,000.00',
            cardColor: '#1a1a1a',
            isPrimary: true,
            transactions: [
<<<<<<< HEAD
                // DEC 2025 (existing + more)
                { icon: '🛍️', merchant: 'Louis Vuitton', date: 'Dec 12, 2025', amount: '-$2,450.00', category: 'Shopping' },
                { icon: '✈️', merchant: 'Emirates Airlines', date: 'Dec 10, 2025', amount: '-$8,750.00', category: 'Travel' },
                { icon: '🍽️', merchant: 'Nobu Restaurant', date: 'Dec 8, 2025', amount: '-$485.00', category: 'Dining' },
                { icon: '🏨', merchant: 'Four Seasons Hotel', date: 'Dec 5, 2025', amount: '-$3,200.00', category: 'Travel' },
                { icon: '💎', merchant: 'Tiffany & Co.', date: 'Dec 1, 2025', amount: '-$12,800.00', category: 'Shopping' },
                { icon: '🚗', merchant: 'Porsche Dealership', date: 'Nov 28, 2025', amount: '-$185,000.00', category: 'Auto' },

                // NOV 2025
                { icon: '🎨', merchant: 'Sotheby’s Auction', date: 'Nov 18, 2025', amount: '-$92,000.00', category: 'Shopping' },
                { icon: '🏡', merchant: 'Interior Design Studio', date: 'Nov 9, 2025', amount: '-$24,500.00', category: 'Home' },
                { icon: '🛫', merchant: 'Private Aviation Charter', date: 'Nov 2, 2025', amount: '-$38,750.00', category: 'Travel' },

                // OCT 2025
                { icon: '⌚', merchant: 'Patek Philippe Boutique', date: 'Oct 21, 2025', amount: '-$68,000.00', category: 'Shopping' },
                { icon: '🏨', merchant: 'Aman Resort', date: 'Oct 12, 2025', amount: '-$14,950.00', category: 'Travel' },
                { icon: '💎', merchant: 'Cartier', date: 'Oct 3, 2025', amount: '-$19,800.00', category: 'Shopping' },

                // SEP 2025
                { icon: '🛥️', merchant: 'Marina Berthing Fees', date: 'Sep 25, 2025', amount: '-$6,250.00', category: 'Lifestyle' },
                { icon: '🧳', merchant: 'Luxury Luggage Set', date: 'Sep 14, 2025', amount: '-$4,980.00', category: 'Shopping' },
                { icon: '🏨', merchant: 'St. Regis Hotel', date: 'Sep 2, 2025', amount: '-$8,400.00', category: 'Travel' },

                // AUG 2025
                { icon: '🚘', merchant: 'Range Rover SV Order', date: 'Aug 27, 2025', amount: '-$12,500.00', category: 'Auto' },
                { icon: '🖼️', merchant: 'Contemporary Art Gallery', date: 'Aug 16, 2025', amount: '-$41,000.00', category: 'Shopping' },
                { icon: '✈️', merchant: 'Qantas First', date: 'Aug 5, 2025', amount: '-$9,650.00', category: 'Travel' },

                // JUL 2025
                { icon: '🏠', merchant: 'Architectural Services', date: 'Jul 22, 2025', amount: '-$27,300.00', category: 'Home' },
                { icon: '💎', merchant: 'Van Cleef & Arpels', date: 'Jul 11, 2025', amount: '-$33,500.00', category: 'Shopping' },
                { icon: '🏨', merchant: 'Park Hyatt', date: 'Jul 2, 2025', amount: '-$5,900.00', category: 'Travel' },

                // JUN 2025
                { icon: '🧑‍🍳', merchant: 'Private Chef Services', date: 'Jun 19, 2025', amount: '-$3,600.00', category: 'Lifestyle' },
                { icon: '🎟️', merchant: 'VIP Event Hospitality', date: 'Jun 8, 2025', amount: '-$7,250.00', category: 'Entertainment' },
                { icon: '💼', merchant: 'Tailor (Bespoke Suit)', date: 'Jun 1, 2025', amount: '-$4,400.00', category: 'Shopping' },

                // MAY 2025
                { icon: '🛋️', merchant: 'Design Furniture Purchase', date: 'May 24, 2025', amount: '-$18,950.00', category: 'Home' },
                { icon: '🏝️', merchant: 'Luxury Villa Deposit', date: 'May 13, 2025', amount: '-$22,000.00', category: 'Travel' },
                { icon: '💎', merchant: 'Diamond District Jeweller', date: 'May 3, 2025', amount: '-$58,700.00', category: 'Shopping' },

                // APR 2025
                { icon: '🚗', merchant: 'Porsche Service (Major)', date: 'Apr 20, 2025', amount: '-$7,850.00', category: 'Auto' },
                { icon: '🖼️', merchant: 'Art Basel Purchase', date: 'Apr 12, 2025', amount: '-$120,000.00', category: 'Shopping' },
                { icon: '🏨', merchant: 'Capella Hotel', date: 'Apr 2, 2025', amount: '-$6,400.00', category: 'Travel' },

                // MAR 2025
                { icon: '🛥️', merchant: 'Yacht Maintenance', date: 'Mar 23, 2025', amount: '-$9,950.00', category: 'Lifestyle' },
                { icon: '✈️', merchant: 'Singapore Airlines Suites', date: 'Mar 10, 2025', amount: '-$11,200.00', category: 'Travel' },
                { icon: '⌚', merchant: 'Luxury Watch Purchase', date: 'Mar 1, 2025', amount: '-$24,600.00', category: 'Shopping' },

                // FEB 2025
                { icon: '🏡', merchant: 'Property Styling', date: 'Feb 21, 2025', amount: '-$13,400.00', category: 'Home' },
                { icon: '💎', merchant: 'Bulgari', date: 'Feb 9, 2025', amount: '-$17,250.00', category: 'Shopping' },
                { icon: '🏨', merchant: 'Mandarin Oriental', date: 'Feb 2, 2025', amount: '-$8,150.00', category: 'Travel' },

                // JAN 2025
                { icon: '✈️', merchant: 'Qantas First (Intl)', date: 'Jan 26, 2025', amount: '-$10,950.00', category: 'Travel' },
                { icon: '🛍️', merchant: 'Hermès (Birkins & Leather)', date: 'Jan 15, 2025', amount: '-$32,800.00', category: 'Shopping' },
                { icon: '🎿', merchant: 'Luxury Ski Package', date: 'Jan 4, 2025', amount: '-$14,200.00', category: 'Travel' }
=======
               { icon: '🏨', merchant: 'Crown Towers Sydney (Villas / Penthouse)', date: 'Dec 14, 2025', amount: '-$48,600.00', category: 'Travel' },
    { icon: '💎', merchant: 'Van Cleef & Arpels', date: 'Dec 12, 2025', amount: '-$86,400.00', category: 'Luxury' },
    { icon: '✈️', merchant: 'Jet-A Fuel (Private Aviation)', date: 'Dec 10, 2025', amount: '-$31,250.00', category: 'Aviation' },
    { icon: '👨‍✈️', merchant: 'Flight Crew Services (Payroll)', date: 'Dec 09, 2025', amount: '-$22,800.00', category: 'Aviation' },
    { icon: '🛥️', merchant: 'Yacht Crew Payroll', date: 'Dec 08, 2025', amount: '-$18,950.00', category: 'Yachting' },
    { icon: '🛠️', merchant: 'Superyacht Engineering & Maintenance', date: 'Dec 06, 2025', amount: '-$27,480.00', category: 'Yachting' },
    { icon: '🚗', merchant: 'McLaren Sydney (Deposit)', date: 'Dec 03, 2025', amount: '-$75,000.00', category: 'Auto' },

    // NOV 2025
    { icon: '🏨', merchant: 'Crown Towers Sydney (Suite Stay)', date: 'Nov 28, 2025', amount: '-$22,400.00', category: 'Travel' },
    { icon: '💎', merchant: 'Van Cleef & Arpels', date: 'Nov 22, 2025', amount: '-$41,900.00', category: 'Luxury' },
    { icon: '🛥️', merchant: 'Marina Berth Fees (Quarterly)', date: 'Nov 18, 2025', amount: '-$12,750.00', category: 'Yachting' },
    { icon: '✈️', merchant: 'Hangar & Handling Fees', date: 'Nov 14, 2025', amount: '-$9,800.00', category: 'Aviation' },
    { icon: '🚗', merchant: 'Rolls-Royce Motor Cars (Purchase)', date: 'Nov 08, 2025', amount: '-$895,000.00', category: 'Auto' },

    // OCT 2025
    { icon: '🛥️', merchant: 'Yacht Refit (Interior + Detailing)', date: 'Oct 27, 2025', amount: '-$68,300.00', category: 'Yachting' },
    { icon: '👨‍✈️', merchant: 'Flight Crew Services (Payroll)', date: 'Oct 24, 2025', amount: '-$22,800.00', category: 'Aviation' },
    { icon: '🛥️', merchant: 'Yacht Crew Payroll', date: 'Oct 21, 2025', amount: '-$18,950.00', category: 'Yachting' },
    { icon: '💎', merchant: 'Van Cleef & Arpels', date: 'Oct 13, 2025', amount: '-$59,750.00', category: 'Luxury' },
    { icon: '🚗', merchant: 'Ferrari Sydney (Annual Service)', date: 'Oct 05, 2025', amount: '-$6,950.00', category: 'Auto' },

    // SEP 2025
    { icon: '✈️', merchant: 'Private Jet Maintenance (A-Check)', date: 'Sep 26, 2025', amount: '-$44,200.00', category: 'Aviation' },
    { icon: '✈️', merchant: 'Jet Catering & Cabin Supplies', date: 'Sep 24, 2025', amount: '-$6,480.00', category: 'Aviation' },
    { icon: '🛥️', merchant: 'Yacht Fuel & Provisioning', date: 'Sep 20, 2025', amount: '-$14,650.00', category: 'Yachting' },
    { icon: '🚗', merchant: 'Lamborghini Sydney (Deposit)', date: 'Sep 12, 2025', amount: '-$50,000.00', category: 'Auto' },
    { icon: '🏨', merchant: 'Crown Towers Sydney (Long Stay)', date: 'Sep 06, 2025', amount: '-$39,900.00', category: 'Travel' },

    // AUG 2025
    { icon: '🛥️', merchant: 'Yacht Crew Payroll', date: 'Aug 28, 2025', amount: '-$18,950.00', category: 'Yachting' },
    { icon: '👨‍✈️', merchant: 'Flight Crew Services (Payroll)', date: 'Aug 26, 2025', amount: '-$22,800.00', category: 'Aviation' },
    { icon: '🛠️', merchant: 'Yacht Engine Works', date: 'Aug 22, 2025', amount: '-$32,500.00', category: 'Yachting' },
    { icon: '💎', merchant: 'Van Cleef & Arpels', date: 'Aug 15, 2025', amount: '-$74,300.00', category: 'Luxury' },
    { icon: '🚗', merchant: 'Porsche Centre Sydney (Allocation + Options)', date: 'Aug 03, 2025', amount: '-$28,900.00', category: 'Auto' },

    // JUL 2025
    { icon: '🏨', merchant: 'Crown Towers Sydney (Villa Booking)', date: 'Jul 29, 2025', amount: '-$26,800.00', category: 'Travel' },
    { icon: '🛥️', merchant: 'Marina Berth Fees (Quarterly)', date: 'Jul 24, 2025', amount: '-$12,750.00', category: 'Yachting' },
    { icon: '✈️', merchant: 'Jet-A Fuel (Private Aviation)', date: 'Jul 21, 2025', amount: '-$28,900.00', category: 'Aviation' },
    { icon: '🛥️', merchant: 'Yacht Crew Payroll', date: 'Jul 20, 2025', amount: '-$18,950.00', category: 'Yachting' },
    { icon: '👨‍✈️', merchant: 'Flight Crew Services (Payroll)', date: 'Jul 18, 2025', amount: '-$22,800.00', category: 'Aviation' },
    { icon: '🚗', merchant: 'Ceramic Coating + PPF (Supercar)', date: 'Jul 10, 2025', amount: '-$9,400.00', category: 'Auto' },

    // JUN 2025
    { icon: '💎', merchant: 'Van Cleef & Arpels', date: 'Jun 28, 2025', amount: '-$33,850.00', category: 'Luxury' },
    { icon: '✈️', merchant: 'Hangar & Handling Fees', date: 'Jun 24, 2025', amount: '-$9,800.00', category: 'Aviation' },
    { icon: '🛥️', merchant: 'Yacht Crew Payroll', date: 'Jun 22, 2025', amount: '-$18,950.00', category: 'Yachting' },
    { icon: '🛠️', merchant: 'Yacht Electrical Systems Upgrade', date: 'Jun 19, 2025', amount: '-$21,600.00', category: 'Yachting' },
    { icon: '🚗', merchant: 'Aston Martin Sydney (Service + Parts)', date: 'Jun 08, 2025', amount: '-$7,850.00', category: 'Auto' },

    // MAY 2025
    { icon: '🏨', merchant: 'Crown Towers Sydney (Penthouse)', date: 'May 30, 2025', amount: '-$45,200.00', category: 'Travel' },
    { icon: '👨‍✈️', merchant: 'Flight Crew Services (Payroll)', date: 'May 26, 2025', amount: '-$22,800.00', category: 'Aviation' },
    { icon: '🛥️', merchant: 'Yacht Crew Payroll', date: 'May 25, 2025', amount: '-$18,950.00', category: 'Yachting' },
    { icon: '🛥️', merchant: 'Yacht Provisioning (Event Week)', date: 'May 23, 2025', amount: '-$11,200.00', category: 'Yachting' },
    { icon: '🚗', merchant: 'Luxury Car Storage (Annual)', date: 'May 12, 2025', amount: '-$8,400.00', category: 'Auto' },

    // APR 2025
    { icon: '💎', merchant: 'Van Cleef & Arpels', date: 'Apr 26, 2025', amount: '-$92,700.00', category: 'Luxury' },
    { icon: '✈️', merchant: 'Private Jet Insurance (Annual)', date: 'Apr 20, 2025', amount: '-$58,000.00', category: 'Aviation' },
    { icon: '🛥️', merchant: 'Superyacht Insurance (Annual)', date: 'Apr 18, 2025', amount: '-$72,500.00', category: 'Yachting' },
    { icon: '🚗', merchant: 'Bentley Sydney (Purchase)', date: 'Apr 05, 2025', amount: '-$512,000.00', category: 'Auto' },

    // MAR 2025
    { icon: '🏨', merchant: 'Crown Towers Sydney (Suite Stay)', date: 'Mar 29, 2025', amount: '-$19,600.00', category: 'Travel' },
    { icon: '✈️', merchant: 'Jet-A Fuel (Private Aviation)', date: 'Mar 22, 2025', amount: '-$26,750.00', category: 'Aviation' },
    { icon: '👨‍✈️', merchant: 'Flight Crew Services (Payroll)', date: 'Mar 20, 2025', amount: '-$22,800.00', category: 'Aviation' },
    { icon: '🛥️', merchant: 'Yacht Crew Payroll', date: 'Mar 19, 2025', amount: '-$18,950.00', category: 'Yachting' },
    { icon: '🚗', merchant: 'Tyres & Brakes (Supercar Fleet)', date: 'Mar 08, 2025', amount: '-$12,900.00', category: 'Auto' },

    // FEB 2025
    { icon: '💎', merchant: 'Van Cleef & Arpels', date: 'Feb 27, 2025', amount: '-$47,250.00', category: 'Luxury' },
    { icon: '🛠️', merchant: 'Yacht Maintenance (Hull + Paint)', date: 'Feb 22, 2025', amount: '-$55,600.00', category: 'Yachting' },
    { icon: '✈️', merchant: 'Private Jet Avionics Update', date: 'Feb 18, 2025', amount: '-$39,900.00', category: 'Aviation' },
    { icon: '🚗', merchant: 'Mercedes-Benz (G-Wagon) Purchase', date: 'Feb 05, 2025', amount: '-$382,000.00', category: 'Auto' },

    // JAN 2025
    { icon: '🏨', merchant: 'Crown Towers Sydney (Penthouse)', date: 'Jan 31, 2025', amount: '-$41,800.00', category: 'Travel' },
    { icon: '🛥️', merchant: 'Marina Berth Fees (Quarterly)', date: 'Jan 24, 2025', amount: '-$12,750.00', category: 'Yachting' },
    { icon: '👨‍✈️', merchant: 'Flight Crew Services (Payroll)', date: 'Jan 21, 2025', amount: '-$22,800.00', category: 'Aviation' },
    { icon: '🛥️', merchant: 'Yacht Crew Payroll', date: 'Jan 20, 2025', amount: '-$18,950.00', category: 'Yachting' },
    { icon: '💎', merchant: 'Van Cleef & Arpels', date: 'Jan 12, 2025', amount: '-$63,900.00', category: 'Luxury' },
    { icon: '🚗', merchant: 'Porsche Dealership (Vehicle Purchase)', date: 'Jan 06, 2025', amount: '-$465,000.00', category: 'Auto' }
>>>>>>> a15b3dc (userconfig changes; crypto wallet changes)
            ]
        },

        platinum: {
            id: 'platinum',
            name: 'Platinum Card',
            shortName: 'Platinum',
            lastFour: '4521',
            fullNumber: '•••• •••• •••• 4521',
            balance: '$2,156,847.82',
            balanceRaw: 2156847.82,
            image: 'images/AMEX/platinum.jpg',
            memberSince: '2025',
            creditLimit: '$5,000,000.00',
            creditLimitRaw: 5000000,
            availableCredit: '$2,843,152.18',
            availableCreditRaw: 2843152.18,
            rewardsPoints: 156847,
            apr: '21.99%',
            nextPaymentDue: 'Jan 15, 2026',
            minimumPayment: '$15,000.00',
            cardColor: '#8a8a8a',
            isPrimary: false,
            transactions: [
<<<<<<< HEAD
                // DEC 2025 (existing + more realistic normal spend)
                { icon: '🎭', merchant: 'Broadway Tickets', date: 'Dec 11, 2025', amount: '-$1,850.00', category: 'Entertainment' },
                { icon: '🍷', merchant: 'Wine Collection', date: 'Dec 9, 2025', amount: '-$4,200.00', category: 'Shopping' },
                { icon: '🏌️', merchant: 'Country Club Membership', date: 'Dec 7, 2025', amount: '-$25,000.00', category: 'Lifestyle' },
                { icon: '👔', merchant: 'Hermès', date: 'Dec 6, 2025', amount: '-$8,900.00', category: 'Shopping' },
                { icon: '🎿', merchant: 'Aspen Ski Resort', date: 'Dec 4, 2025', amount: '-$15,600.00', category: 'Travel' },
                { icon: '🖼️', merchant: 'Art Gallery Purchase', date: 'Dec 2, 2025', amount: '-$45,000.00', category: 'Shopping' },
                { icon: '⌚', merchant: 'Rolex Boutique', date: 'Nov 30, 2025', amount: '-$32,500.00', category: 'Shopping' },
                { icon: '🛥️', merchant: 'Yacht Club Dues', date: 'Nov 25, 2025', amount: '-$18,000.00', category: 'Lifestyle' },

                { icon: '☕', merchant: 'Campos Coffee', date: 'Dec 13, 2025', amount: '-$7.80', category: 'Dining' },
                { icon: '🛒', merchant: 'Woolworths', date: 'Dec 13, 2025', amount: '-$186.42', category: 'Groceries' },
                { icon: '⛽', merchant: 'BP Service Station', date: 'Dec 12, 2025', amount: '-$104.55', category: 'Auto' },
                { icon: '🚕', merchant: 'Uber', date: 'Dec 12, 2025', amount: '-$28.60', category: 'Transport' },
                { icon: '📱', merchant: 'Telstra', date: 'Dec 10, 2025', amount: '-$89.00', category: 'Utilities' },
                { icon: '🎬', merchant: 'Apple TV+', date: 'Dec 8, 2025', amount: '-$12.99', category: 'Subscriptions' },
                { icon: '🏋️', merchant: 'Fitness First', date: 'Dec 6, 2025', amount: '-$29.95', category: 'Health' },

                // NOV 2025
                { icon: '🛒', merchant: 'Coles', date: 'Nov 23, 2025', amount: '-$142.18', category: 'Groceries' },
                { icon: '🍔', merchant: 'Grill’d', date: 'Nov 21, 2025', amount: '-$24.90', category: 'Dining' },
                { icon: '🚆', merchant: 'Opal Travel', date: 'Nov 19, 2025', amount: '-$43.50', category: 'Transport' },
                { icon: '🧴', merchant: 'Chemist Warehouse', date: 'Nov 16, 2025', amount: '-$57.35', category: 'Health' },
                { icon: '💻', merchant: 'Microsoft 365', date: 'Nov 14, 2025', amount: '-$15.00', category: 'Subscriptions' },
                { icon: '🏠', merchant: 'AGL Energy', date: 'Nov 10, 2025', amount: '-$212.40', category: 'Utilities' },
                { icon: '🌯', merchant: 'Guzman y Gomez', date: 'Nov 7, 2025', amount: '-$18.60', category: 'Dining' },
                { icon: '🛒', merchant: 'Harris Farm Markets', date: 'Nov 2, 2025', amount: '-$98.22', category: 'Groceries' },

                // OCT 2025
                { icon: '🛒', merchant: 'Woolworths', date: 'Oct 28, 2025', amount: '-$173.06', category: 'Groceries' },
                { icon: '☕', merchant: 'The Grounds of Alexandria', date: 'Oct 26, 2025', amount: '-$34.20', category: 'Dining' },
                { icon: '⛽', merchant: 'Shell', date: 'Oct 22, 2025', amount: '-$92.10', category: 'Auto' },
                { icon: '🧾', merchant: 'Sydney Water', date: 'Oct 20, 2025', amount: '-$118.70', category: 'Utilities' },
                { icon: '🛍️', merchant: 'Kmart', date: 'Oct 16, 2025', amount: '-$74.00', category: 'Shopping' },
                { icon: '🎵', merchant: 'Spotify', date: 'Oct 14, 2025', amount: '-$13.99', category: 'Subscriptions' },
                { icon: '🍣', merchant: 'Sushi Hub', date: 'Oct 9, 2025', amount: '-$21.80', category: 'Dining' },
                { icon: '🚕', merchant: 'Uber', date: 'Oct 5, 2025', amount: '-$19.40', category: 'Transport' },

                // SEP 2025
                { icon: '🛒', merchant: 'Coles', date: 'Sep 29, 2025', amount: '-$156.84', category: 'Groceries' },
                { icon: '🥗', merchant: 'Fishbowl', date: 'Sep 25, 2025', amount: '-$19.90', category: 'Dining' },
                { icon: '🩺', merchant: 'Bupa Health', date: 'Sep 20, 2025', amount: '-$219.60', category: 'Health' },
                { icon: '🚆', merchant: 'Opal Travel', date: 'Sep 18, 2025', amount: '-$38.70', category: 'Transport' },
                { icon: '🛍️', merchant: 'Officeworks', date: 'Sep 12, 2025', amount: '-$64.95', category: 'Shopping' },
                { icon: '📦', merchant: 'Amazon AU', date: 'Sep 10, 2025', amount: '-$49.99', category: 'Shopping' },
                { icon: '🍕', merchant: 'Domino’s', date: 'Sep 6, 2025', amount: '-$27.45', category: 'Dining' },
                { icon: '🎮', merchant: 'PlayStation Network', date: 'Sep 3, 2025', amount: '-$12.95', category: 'Subscriptions' },

                // AUG 2025
                { icon: '🛒', merchant: 'Woolworths', date: 'Aug 30, 2025', amount: '-$168.11', category: 'Groceries' },
                { icon: '☕', merchant: 'Single O', date: 'Aug 27, 2025', amount: '-$6.50', category: 'Dining' },
                { icon: '⛽', merchant: 'BP Service Station', date: 'Aug 24, 2025', amount: '-$88.20', category: 'Auto' },
                { icon: '🧾', merchant: 'Origin Energy', date: 'Aug 19, 2025', amount: '-$204.90', category: 'Utilities' },
                { icon: '🎬', merchant: 'Netflix', date: 'Aug 16, 2025', amount: '-$16.99', category: 'Subscriptions' },
                { icon: '🍜', merchant: 'Menya Mappen', date: 'Aug 11, 2025', amount: '-$22.30', category: 'Dining' },
                { icon: '🚕', merchant: 'Uber', date: 'Aug 7, 2025', amount: '-$26.75', category: 'Transport' },
                { icon: '🛍️', merchant: 'Bunnings Warehouse', date: 'Aug 2, 2025', amount: '-$83.40', category: 'Home' },

                // JUL 2025
                { icon: '🛒', merchant: 'Coles', date: 'Jul 28, 2025', amount: '-$149.77', category: 'Groceries' },
                { icon: '🍔', merchant: 'Oporto', date: 'Jul 24, 2025', amount: '-$18.25', category: 'Dining' },
                { icon: '🚆', merchant: 'Opal Travel', date: 'Jul 21, 2025', amount: '-$41.20', category: 'Transport' },
                { icon: '🧴', merchant: 'Priceline Pharmacy', date: 'Jul 18, 2025', amount: '-$33.90', category: 'Health' },
                { icon: '🏠', merchant: 'NBN Co (Internet)', date: 'Jul 14, 2025', amount: '-$85.00', category: 'Utilities' },
                { icon: '☕', merchant: 'Gumption by Coffee Alchemy', date: 'Jul 9, 2025', amount: '-$5.80', category: 'Dining' },
                { icon: '🛍️', merchant: 'David Jones', date: 'Jul 6, 2025', amount: '-$219.00', category: 'Shopping' },
                { icon: '🍣', merchant: 'Sushi Train', date: 'Jul 2, 2025', amount: '-$29.40', category: 'Dining' },

                // JUN 2025
                { icon: '🛒', merchant: 'Harris Farm Markets', date: 'Jun 28, 2025', amount: '-$121.33', category: 'Groceries' },
                { icon: '🥪', merchant: 'Baker Bleu', date: 'Jun 24, 2025', amount: '-$16.80', category: 'Dining' },
                { icon: '⛽', merchant: 'Caltex', date: 'Jun 21, 2025', amount: '-$96.70', category: 'Auto' },
                { icon: '🧾', merchant: 'Council Rates Payment', date: 'Jun 18, 2025', amount: '-$1,245.00', category: 'Bills' },
                { icon: '🎵', merchant: 'Apple Music', date: 'Jun 14, 2025', amount: '-$12.99', category: 'Subscriptions' },
                { icon: '🍜', merchant: 'Marrickville Pork Roll', date: 'Jun 10, 2025', amount: '-$15.50', category: 'Dining' },
                { icon: '🚕', merchant: 'Uber', date: 'Jun 7, 2025', amount: '-$22.10', category: 'Transport' },
                { icon: '🛍️', merchant: 'JB Hi-Fi', date: 'Jun 2, 2025', amount: '-$129.00', category: 'Shopping' },

                // MAY 2025
                { icon: '🛒', merchant: 'Woolworths', date: 'May 29, 2025', amount: '-$177.62', category: 'Groceries' },
                { icon: '☕', merchant: 'Café in the Alley', date: 'May 26, 2025', amount: '-$9.20', category: 'Dining' },
                { icon: '🚆', merchant: 'Opal Travel', date: 'May 22, 2025', amount: '-$36.40', category: 'Transport' },
                { icon: '🧾', merchant: 'AGL Energy', date: 'May 18, 2025', amount: '-$198.30', category: 'Utilities' },
                { icon: '🛍️', merchant: 'Kmart', date: 'May 14, 2025', amount: '-$58.00', category: 'Shopping' },
                { icon: '🍔', merchant: 'Betty’s Burgers', date: 'May 10, 2025', amount: '-$31.70', category: 'Dining' },
                { icon: '🧴', merchant: 'Chemist Warehouse', date: 'May 6, 2025', amount: '-$44.60', category: 'Health' },
                { icon: '🎬', merchant: 'Stan', date: 'May 3, 2025', amount: '-$12.00', category: 'Subscriptions' },

                // APR 2025
                { icon: '🛒', merchant: 'Coles', date: 'Apr 27, 2025', amount: '-$163.09', category: 'Groceries' },
                { icon: '🍣', merchant: 'Sushi Hub', date: 'Apr 23, 2025', amount: '-$19.60', category: 'Dining' },
                { icon: '⛽', merchant: 'Shell', date: 'Apr 20, 2025', amount: '-$90.35', category: 'Auto' },
                { icon: '🧾', merchant: 'Sydney Water', date: 'Apr 17, 2025', amount: '-$124.80', category: 'Utilities' },
                { icon: '🛍️', merchant: 'Officeworks', date: 'Apr 12, 2025', amount: '-$38.95', category: 'Shopping' },
                { icon: '🚕', merchant: 'Uber', date: 'Apr 8, 2025', amount: '-$24.90', category: 'Transport' },
                { icon: '☕', merchant: 'Bluestone Lane', date: 'Apr 5, 2025', amount: '-$6.10', category: 'Dining' },
                { icon: '🎵', merchant: 'Spotify', date: 'Apr 2, 2025', amount: '-$13.99', category: 'Subscriptions' },

                // MAR 2025
                { icon: '🛒', merchant: 'Harris Farm Markets', date: 'Mar 29, 2025', amount: '-$134.56', category: 'Groceries' },
                { icon: '🍔', merchant: 'Grill’d', date: 'Mar 24, 2025', amount: '-$22.90', category: 'Dining' },
                { icon: '🚆', merchant: 'Opal Travel', date: 'Mar 19, 2025', amount: '-$40.10', category: 'Transport' },
                { icon: '🏥', merchant: 'Medical Centre', date: 'Mar 16, 2025', amount: '-$85.00', category: 'Health' },
                { icon: '🧾', merchant: 'Origin Energy', date: 'Mar 12, 2025', amount: '-$210.75', category: 'Utilities' },
                { icon: '🛍️', merchant: 'Bunnings Warehouse', date: 'Mar 8, 2025', amount: '-$67.20', category: 'Home' },
                { icon: '☕', merchant: 'Campos Coffee', date: 'Mar 5, 2025', amount: '-$5.50', category: 'Dining' },
                { icon: '📦', merchant: 'Amazon AU', date: 'Mar 2, 2025', amount: '-$39.95', category: 'Shopping' },

                // FEB 2025
                { icon: '🛒', merchant: 'Woolworths', date: 'Feb 26, 2025', amount: '-$171.40', category: 'Groceries' },
                { icon: '🍜', merchant: 'Ichiban Boshi', date: 'Feb 22, 2025', amount: '-$28.80', category: 'Dining' },
                { icon: '⛽', merchant: 'BP Service Station', date: 'Feb 18, 2025', amount: '-$87.65', category: 'Auto' },
                { icon: '🧾', merchant: 'Telstra', date: 'Feb 14, 2025', amount: '-$89.00', category: 'Utilities' },
                { icon: '🎬', merchant: 'Netflix', date: 'Feb 10, 2025', amount: '-$16.99', category: 'Subscriptions' },
                { icon: '🛍️', merchant: 'Uniqlo', date: 'Feb 7, 2025', amount: '-$129.90', category: 'Shopping' },
                { icon: '🚕', merchant: 'Uber', date: 'Feb 4, 2025', amount: '-$21.30', category: 'Transport' },
                { icon: '☕', merchant: 'Single O', date: 'Feb 1, 2025', amount: '-$6.20', category: 'Dining' },

                // JAN 2025
                { icon: '🛒', merchant: 'Coles', date: 'Jan 29, 2025', amount: '-$158.73', category: 'Groceries' },
                { icon: '🍕', merchant: 'Domino’s', date: 'Jan 25, 2025', amount: '-$32.10', category: 'Dining' },
                { icon: '🚆', merchant: 'Opal Travel', date: 'Jan 20, 2025', amount: '-$35.60', category: 'Transport' },
                { icon: '🧾', merchant: 'AGL Energy', date: 'Jan 17, 2025', amount: '-$195.10', category: 'Utilities' },
                { icon: '🧴', merchant: 'Chemist Warehouse', date: 'Jan 13, 2025', amount: '-$52.40', category: 'Health' },
                { icon: '🎵', merchant: 'Spotify', date: 'Jan 10, 2025', amount: '-$13.99', category: 'Subscriptions' },
                { icon: '🛍️', merchant: 'Officeworks', date: 'Jan 6, 2025', amount: '-$27.95', category: 'Shopping' },
                { icon: '☕', merchant: 'Campos Coffee', date: 'Jan 3, 2025', amount: '-$5.80', category: 'Dining' }
=======
                { icon: '🛒', merchant: 'Woolworths', date: 'Dec 13, 2025', amount: '-$186.42', category: 'Groceries' },
                { icon: '☕', merchant: 'Toby’s Estate Coffee', date: 'Dec 13, 2025', amount: '-$6.20', category: 'Coffee' },
                { icon: '🚗', merchant: 'Ampol', date: 'Dec 12, 2025', amount: '-$98.10', category: 'Fuel' },
                { icon: '🍜', merchant: 'Chat Thai', date: 'Dec 12, 2025', amount: '-$42.50', category: 'Dining' },
                { icon: '🧾', merchant: 'Telstra', date: 'Dec 11, 2025', amount: '-$129.00', category: 'Utilities' },
                { icon: '🚕', merchant: 'Uber', date: 'Dec 11, 2025', amount: '-$23.18', category: 'Transport' },
                { icon: '💊', merchant: 'Chemist Warehouse', date: 'Dec 10, 2025', amount: '-$38.99', category: 'Health' },
                { icon: '🍔', merchant: 'Grill’d', date: 'Dec 10, 2025', amount: '-$27.40', category: 'Dining' },
                { icon: '🧰', merchant: 'Bunnings', date: 'Dec 09, 2025', amount: '-$64.75', category: 'Home' },
                { icon: '🎧', merchant: 'Spotify', date: 'Dec 09, 2025', amount: '-$13.99', category: 'Subscription' },
                { icon: '🛒', merchant: 'Coles', date: 'Dec 08, 2025', amount: '-$112.36', category: 'Groceries' },
                { icon: '🍣', merchant: 'Sushi Hub', date: 'Dec 08, 2025', amount: '-$18.90', category: 'Dining' },
                { icon: '🧼', merchant: 'Kmart', date: 'Dec 07, 2025', amount: '-$54.00', category: 'Shopping' },
                { icon: '🏋️', merchant: 'Fitness First', date: 'Dec 07, 2025', amount: '-$34.95', category: 'Fitness' },
                { icon: '🎬', merchant: 'Netflix', date: 'Dec 06, 2025', amount: '-$25.99', category: 'Subscription' },
                { icon: '🚕', merchant: 'Uber', date: 'Dec 06, 2025', amount: '-$19.44', category: 'Transport' },
                { icon: '🛍️', merchant: 'David Jones', date: 'Dec 05, 2025', amount: '-$219.00', category: 'Shopping' },
                { icon: '🍕', merchant: 'Fratelli Fresh', date: 'Dec 05, 2025', amount: '-$96.20', category: 'Dining' },
                { icon: '🚇', merchant: 'Opal Top Up', date: 'Dec 04, 2025', amount: '-$50.00', category: 'Transport' },
                { icon: '🛒', merchant: 'Harris Farm Markets', date: 'Dec 04, 2025', amount: '-$141.88', category: 'Groceries' },
                { icon: '📦', merchant: 'Amazon', date: 'Dec 03, 2025', amount: '-$58.47', category: 'Shopping' },
                { icon: '🍗', merchant: 'El Jannah', date: 'Dec 03, 2025', amount: '-$34.70', category: 'Dining' },
                { icon: '📱', merchant: 'Apple (iCloud+)', date: 'Dec 02, 2025', amount: '-$4.49', category: 'Subscription' },
                { icon: '🛠️', merchant: 'Officeworks', date: 'Dec 02, 2025', amount: '-$37.96', category: 'Shopping' },
                { icon: '⛽', merchant: '7-Eleven', date: 'Dec 01, 2025', amount: '-$11.20', category: 'Convenience' },
                { icon: '🛒', merchant: 'Aldi', date: 'Dec 01, 2025', amount: '-$83.55', category: 'Groceries' },

                // Nov 2025
                { icon: '🛒', merchant: 'Woolworths', date: 'Nov 30, 2025', amount: '-$172.09', category: 'Groceries' },
                { icon: '☕', merchant: 'Campos Coffee', date: 'Nov 30, 2025', amount: '-$5.80', category: 'Coffee' },
                { icon: '🚗', merchant: 'BP', date: 'Nov 29, 2025', amount: '-$92.40', category: 'Fuel' },
                { icon: '🍲', merchant: 'Din Tai Fung', date: 'Nov 29, 2025', amount: '-$78.60', category: 'Dining' },
                { icon: '🧾', merchant: 'Origin Energy', date: 'Nov 28, 2025', amount: '-$168.33', category: 'Utilities' },
                { icon: '💊', merchant: 'Priceline Pharmacy', date: 'Nov 28, 2025', amount: '-$26.50', category: 'Health' },
                { icon: '🛍️', merchant: 'UNIQLO', date: 'Nov 27, 2025', amount: '-$89.90', category: 'Shopping' },
                { icon: '🚕', merchant: 'Uber', date: 'Nov 27, 2025', amount: '-$21.72', category: 'Transport' },
                { icon: '🍔', merchant: 'Guzman y Gomez', date: 'Nov 26, 2025', amount: '-$19.30', category: 'Dining' },
                { icon: '🧰', merchant: 'Bunnings', date: 'Nov 26, 2025', amount: '-$142.18', category: 'Home' },
                { icon: '🎬', merchant: 'Stan', date: 'Nov 25, 2025', amount: '-$15.99', category: 'Subscription' },
                { icon: '🛒', merchant: 'Coles', date: 'Nov 25, 2025', amount: '-$104.22', category: 'Groceries' },
                { icon: '🧑‍⚕️', merchant: 'Dental Check-up', date: 'Nov 24, 2025', amount: '-$210.00', category: 'Health' },
                { icon: '🍣', merchant: 'Sushia', date: 'Nov 24, 2025', amount: '-$16.80', category: 'Dining' },
                { icon: '📦', merchant: 'Amazon Prime', date: 'Nov 23, 2025', amount: '-$9.99', category: 'Subscription' },
                { icon: '🏋️', merchant: 'Fitness First', date: 'Nov 23, 2025', amount: '-$34.95', category: 'Fitness' },
                { icon: '🛒', merchant: 'Harris Farm Markets', date: 'Nov 22, 2025', amount: '-$126.40', category: 'Groceries' },
                { icon: '🍕', merchant: 'Criniti’s', date: 'Nov 22, 2025', amount: '-$92.10', category: 'Dining' },
                { icon: '🚇', merchant: 'Opal Top Up', date: 'Nov 21, 2025', amount: '-$40.00', category: 'Transport' },
                { icon: '🛍️', merchant: 'JB Hi-Fi', date: 'Nov 21, 2025', amount: '-$149.00', category: 'Electronics' },
                { icon: '🛒', merchant: 'Woolworths', date: 'Nov 20, 2025', amount: '-$154.63', category: 'Groceries' },
                { icon: '☕', merchant: 'Toby’s Estate Coffee', date: 'Nov 20, 2025', amount: '-$6.00', category: 'Coffee' },

                // Oct 2025
                { icon: '🧾', merchant: 'Sydney Water', date: 'Oct 31, 2025', amount: '-$94.70', category: 'Utilities' },
                { icon: '🛒', merchant: 'Coles', date: 'Oct 31, 2025', amount: '-$118.56', category: 'Groceries' },
                { icon: '🍜', merchant: 'Ramen Zundo', date: 'Oct 30, 2025', amount: '-$28.90', category: 'Dining' },
                { icon: '🚗', merchant: 'Ampol', date: 'Oct 30, 2025', amount: '-$101.30', category: 'Fuel' },
                { icon: '📦', merchant: 'Amazon', date: 'Oct 29, 2025', amount: '-$73.24', category: 'Shopping' },
                { icon: '🧰', merchant: 'Bunnings', date: 'Oct 29, 2025', amount: '-$39.10', category: 'Home' },
                { icon: '🎬', merchant: 'Disney+', date: 'Oct 28, 2025', amount: '-$13.99', category: 'Subscription' },
                { icon: '🚕', merchant: 'Uber', date: 'Oct 28, 2025', amount: '-$17.66', category: 'Transport' },
                { icon: '🛍️', merchant: 'Myer', date: 'Oct 27, 2025', amount: '-$179.00', category: 'Shopping' },
                { icon: '🥗', merchant: 'Fishbowl', date: 'Oct 27, 2025', amount: '-$19.90', category: 'Dining' },
                { icon: '🛒', merchant: 'Woolworths', date: 'Oct 26, 2025', amount: '-$167.41', category: 'Groceries' },
                { icon: '💊', merchant: 'Chemist Warehouse', date: 'Oct 26, 2025', amount: '-$44.60', category: 'Health' },
                { icon: '🏋️', merchant: 'Fitness First', date: 'Oct 25, 2025', amount: '-$34.95', category: 'Fitness' },
                { icon: '🍔', merchant: 'Oporto', date: 'Oct 25, 2025', amount: '-$21.70', category: 'Dining' },
                { icon: '🚇', merchant: 'Opal Top Up', date: 'Oct 24, 2025', amount: '-$50.00', category: 'Transport' },

                // Sep 2025
                { icon: '🛒', merchant: 'Harris Farm Markets', date: 'Sep 30, 2025', amount: '-$133.92', category: 'Groceries' },
                { icon: '☕', merchant: 'Campos Coffee', date: 'Sep 30, 2025', amount: '-$5.50', category: 'Coffee' },
                { icon: '🚗', merchant: 'BP', date: 'Sep 29, 2025', amount: '-$88.25', category: 'Fuel' },
                { icon: '🍣', merchant: 'Sushi Hub', date: 'Sep 29, 2025', amount: '-$17.50', category: 'Dining' },
                { icon: '🧾', merchant: 'AGL Energy', date: 'Sep 28, 2025', amount: '-$156.10', category: 'Utilities' },
                { icon: '🛍️', merchant: 'The Iconic', date: 'Sep 28, 2025', amount: '-$129.95', category: 'Shopping' },
                { icon: '🚕', merchant: 'Uber', date: 'Sep 27, 2025', amount: '-$26.40', category: 'Transport' },
                { icon: '🍕', merchant: 'Pizza Madre', date: 'Sep 27, 2025', amount: '-$64.00', category: 'Dining' },
                { icon: '🛒', merchant: 'Coles', date: 'Sep 26, 2025', amount: '-$109.34', category: 'Groceries' },
                { icon: '💊', merchant: 'Priceline Pharmacy', date: 'Sep 26, 2025', amount: '-$18.99', category: 'Health' },
                { icon: '🧰', merchant: 'Bunnings', date: 'Sep 25, 2025', amount: '-$86.20', category: 'Home' },
                { icon: '🎬', merchant: 'Netflix', date: 'Sep 25, 2025', amount: '-$25.99', category: 'Subscription' },
                { icon: '🏋️', merchant: 'Fitness First', date: 'Sep 24, 2025', amount: '-$34.95', category: 'Fitness' },
                { icon: '🍔', merchant: 'Guzman y Gomez', date: 'Sep 24, 2025', amount: '-$18.70', category: 'Dining' },

                // Aug 2025
                { icon: '🛒', merchant: 'Woolworths', date: 'Aug 31, 2025', amount: '-$161.08', category: 'Groceries' },
                { icon: '☕', merchant: 'Toby’s Estate Coffee', date: 'Aug 31, 2025', amount: '-$6.00', category: 'Coffee' },
                { icon: '🚗', merchant: 'Ampol', date: 'Aug 30, 2025', amount: '-$95.60', category: 'Fuel' },
                { icon: '🍜', merchant: 'Gumshara Ramen', date: 'Aug 30, 2025', amount: '-$34.50', category: 'Dining' },
                { icon: '🧾', merchant: 'Telstra', date: 'Aug 29, 2025', amount: '-$129.00', category: 'Utilities' },
                { icon: '🛍️', merchant: 'Apple Store', date: 'Aug 29, 2025', amount: '-$349.00', category: 'Electronics' },
                { icon: '🚇', merchant: 'Opal Top Up', date: 'Aug 28, 2025', amount: '-$50.00', category: 'Transport' },
                { icon: '🛒', merchant: 'Harris Farm Markets', date: 'Aug 28, 2025', amount: '-$142.67', category: 'Groceries' },
                { icon: '💊', merchant: 'Chemist Warehouse', date: 'Aug 27, 2025', amount: '-$31.10', category: 'Health' },
                { icon: '🍣', merchant: 'Sushia', date: 'Aug 27, 2025', amount: '-$14.60', category: 'Dining' },
                { icon: '🧰', merchant: 'Bunnings', date: 'Aug 26, 2025', amount: '-$58.45', category: 'Home' },
                { icon: '🎬', merchant: 'Stan', date: 'Aug 26, 2025', amount: '-$15.99', category: 'Subscription' },
                { icon: '🏋️', merchant: 'Fitness First', date: 'Aug 25, 2025', amount: '-$34.95', category: 'Fitness' },

                // Jul 2025
                { icon: '🛒', merchant: 'Coles', date: 'Jul 31, 2025', amount: '-$121.90', category: 'Groceries' },
                { icon: '☕', merchant: 'Campos Coffee', date: 'Jul 31, 2025', amount: '-$5.70', category: 'Coffee' },
                { icon: '🚗', merchant: 'BP', date: 'Jul 30, 2025', amount: '-$89.10', category: 'Fuel' },
                { icon: '🍔', merchant: 'Grill’d', date: 'Jul 30, 2025', amount: '-$26.90', category: 'Dining' },
                { icon: '🛍️', merchant: 'Uniqlo', date: 'Jul 29, 2025', amount: '-$74.90', category: 'Shopping' },
                { icon: '🚕', merchant: 'Uber', date: 'Jul 29, 2025', amount: '-$22.05', category: 'Transport' },
                { icon: '🚇', merchant: 'Opal Top Up', date: 'Jul 28, 2025', amount: '-$40.00', category: 'Transport' },
                { icon: '🧾', merchant: 'AGL Energy', date: 'Jul 28, 2025', amount: '-$162.88', category: 'Utilities' },
                { icon: '🛒', merchant: 'Woolworths', date: 'Jul 27, 2025', amount: '-$158.43', category: 'Groceries' },
                { icon: '💊', merchant: 'Priceline Pharmacy', date: 'Jul 27, 2025', amount: '-$24.00', category: 'Health' },
                { icon: '🎬', merchant: 'Netflix', date: 'Jul 26, 2025', amount: '-$25.99', category: 'Subscription' },
                { icon: '🏋️', merchant: 'Fitness First', date: 'Jul 26, 2025', amount: '-$34.95', category: 'Fitness' },

                // Jun 2025
                { icon: '🛒', merchant: 'Harris Farm Markets', date: 'Jun 30, 2025', amount: '-$137.25', category: 'Groceries' },
                { icon: '☕', merchant: 'Toby’s Estate Coffee', date: 'Jun 30, 2025', amount: '-$6.10', category: 'Coffee' },
                { icon: '🚗', merchant: 'Ampol', date: 'Jun 29, 2025', amount: '-$96.80', category: 'Fuel' },
                { icon: '🍜', merchant: 'Ippudo', date: 'Jun 29, 2025', amount: '-$41.30', category: 'Dining' },
                { icon: '🧾', merchant: 'Sydney Water', date: 'Jun 28, 2025', amount: '-$88.60', category: 'Utilities' },
                { icon: '🛍️', merchant: 'Officeworks', date: 'Jun 28, 2025', amount: '-$29.95', category: 'Shopping' },
                { icon: '🚕', merchant: 'Uber', date: 'Jun 27, 2025', amount: '-$18.70', category: 'Transport' },
                { icon: '🍣', merchant: 'Sushi Hub', date: 'Jun 27, 2025', amount: '-$16.20', category: 'Dining' },
                { icon: '🛒', merchant: 'Coles', date: 'Jun 26, 2025', amount: '-$107.44', category: 'Groceries' },
                { icon: '💊', merchant: 'Chemist Warehouse', date: 'Jun 26, 2025', amount: '-$35.50', category: 'Health' },
                { icon: '🏋️', merchant: 'Fitness First', date: 'Jun 25, 2025', amount: '-$34.95', category: 'Fitness' },

                // May 2025
                { icon: '🛒', merchant: 'Woolworths', date: 'May 31, 2025', amount: '-$165.77', category: 'Groceries' },
                { icon: '☕', merchant: 'Campos Coffee', date: 'May 31, 2025', amount: '-$5.90', category: 'Coffee' },
                { icon: '🚗', merchant: 'BP', date: 'May 30, 2025', amount: '-$90.05', category: 'Fuel' },
                { icon: '🍔', merchant: 'Guzman y Gomez', date: 'May 30, 2025', amount: '-$17.80', category: 'Dining' },
                { icon: '🧾', merchant: 'Telstra', date: 'May 29, 2025', amount: '-$129.00', category: 'Utilities' },
                { icon: '📦', merchant: 'Amazon', date: 'May 29, 2025', amount: '-$46.12', category: 'Shopping' },
                { icon: '🚇', merchant: 'Opal Top Up', date: 'May 28, 2025', amount: '-$50.00', category: 'Transport' },
                { icon: '🛒', merchant: 'Harris Farm Markets', date: 'May 28, 2025', amount: '-$139.60', category: 'Groceries' },
                { icon: '🎬', merchant: 'Disney+', date: 'May 27, 2025', amount: '-$13.99', category: 'Subscription' },
                { icon: '🏋️', merchant: 'Fitness First', date: 'May 27, 2025', amount: '-$34.95', category: 'Fitness' },

                // Apr 2025
                { icon: '🛒', merchant: 'Coles', date: 'Apr 30, 2025', amount: '-$114.09', category: 'Groceries' },
                { icon: '☕', merchant: 'Toby’s Estate Coffee', date: 'Apr 30, 2025', amount: '-$6.00', category: 'Coffee' },
                { icon: '🚗', merchant: 'Ampol', date: 'Apr 29, 2025', amount: '-$97.55', category: 'Fuel' },
                { icon: '🍜', merchant: 'Chat Thai', date: 'Apr 29, 2025', amount: '-$39.90', category: 'Dining' },
                { icon: '🧾', merchant: 'AGL Energy', date: 'Apr 28, 2025', amount: '-$151.22', category: 'Utilities' },
                { icon: '🛍️', merchant: 'Kmart', date: 'Apr 28, 2025', amount: '-$62.00', category: 'Shopping' },
                { icon: '🚕', merchant: 'Uber', date: 'Apr 27, 2025', amount: '-$24.15', category: 'Transport' },
                { icon: '🍣', merchant: 'Sushia', date: 'Apr 27, 2025', amount: '-$15.80', category: 'Dining' },
                { icon: '🎬', merchant: 'Netflix', date: 'Apr 26, 2025', amount: '-$25.99', category: 'Subscription' },
                { icon: '🏋️', merchant: 'Fitness First', date: 'Apr 26, 2025', amount: '-$34.95', category: 'Fitness' },

                // Mar 2025
                { icon: '🛒', merchant: 'Woolworths', date: 'Mar 31, 2025', amount: '-$169.34', category: 'Groceries' },
                { icon: '☕', merchant: 'Campos Coffee', date: 'Mar 31, 2025', amount: '-$5.60', category: 'Coffee' },
                { icon: '🚗', merchant: 'BP', date: 'Mar 30, 2025', amount: '-$93.10', category: 'Fuel' },
                { icon: '🍕', merchant: 'Fratelli Fresh', date: 'Mar 30, 2025', amount: '-$88.30', category: 'Dining' },
                { icon: '🧾', merchant: 'Sydney Water', date: 'Mar 29, 2025', amount: '-$91.40', category: 'Utilities' },
                { icon: '🛍️', merchant: 'JB Hi-Fi', date: 'Mar 29, 2025', amount: '-$129.00', category: 'Electronics' },
                { icon: '🚇', merchant: 'Opal Top Up', date: 'Mar 28, 2025', amount: '-$40.00', category: 'Transport' },
                { icon: '🛒', merchant: 'Coles', date: 'Mar 28, 2025', amount: '-$108.71', category: 'Groceries' },
                { icon: '💊', merchant: 'Chemist Warehouse', date: 'Mar 27, 2025', amount: '-$29.95', category: 'Health' },
                { icon: '🍔', merchant: 'Oporto', date: 'Mar 27, 2025', amount: '-$20.40', category: 'Dining' },
                { icon: '🎬', merchant: 'Stan', date: 'Mar 26, 2025', amount: '-$15.99', category: 'Subscription' },
                { icon: '🏋️', merchant: 'Fitness First', date: 'Mar 26, 2025', amount: '-$34.95', category: 'Fitness' },

                // Feb 2025
                { icon: '🛒', merchant: 'Harris Farm Markets', date: 'Feb 28, 2025', amount: '-$144.88', category: 'Groceries' },
                { icon: '☕', merchant: 'Toby’s Estate Coffee', date: 'Feb 28, 2025', amount: '-$6.30', category: 'Coffee' },
                { icon: '🚗', merchant: 'Ampol', date: 'Feb 27, 2025', amount: '-$94.30', category: 'Fuel' },
                { icon: '🍜', merchant: 'Ippudo', date: 'Feb 27, 2025', amount: '-$44.20', category: 'Dining' },
                { icon: '🧾', merchant: 'Telstra', date: 'Feb 26, 2025', amount: '-$129.00', category: 'Utilities' },
                { icon: '🛍️', merchant: 'The Iconic', date: 'Feb 26, 2025', amount: '-$98.50', category: 'Shopping' },
                { icon: '🚕', merchant: 'Uber', date: 'Feb 25, 2025', amount: '-$16.90', category: 'Transport' },
                { icon: '🛒', merchant: 'Coles', date: 'Feb 25, 2025', amount: '-$115.02', category: 'Groceries' },
                { icon: '🎬', merchant: 'Netflix', date: 'Feb 24, 2025', amount: '-$25.99', category: 'Subscription' },
                { icon: '🏋️', merchant: 'Fitness First', date: 'Feb 24, 2025', amount: '-$34.95', category: 'Fitness' },

                // Jan 2025
                { icon: '🛒', merchant: 'Woolworths', date: 'Jan 31, 2025', amount: '-$158.11', category: 'Groceries' },
                { icon: '☕', merchant: 'Campos Coffee', date: 'Jan 31, 2025', amount: '-$5.50', category: 'Coffee' },
                { icon: '🚗', merchant: 'BP', date: 'Jan 30, 2025', amount: '-$91.70', category: 'Fuel' },
                { icon: '🍔', merchant: 'Grill’d', date: 'Jan 30, 2025', amount: '-$25.60', category: 'Dining' },
                { icon: '🧾', merchant: 'AGL Energy', date: 'Jan 29, 2025', amount: '-$149.00', category: 'Utilities' },
                { icon: '🛍️', merchant: 'Officeworks', date: 'Jan 29, 2025', amount: '-$44.95', category: 'Shopping' },
                { icon: '🚇', merchant: 'Opal Top Up', date: 'Jan 28, 2025', amount: '-$50.00', category: 'Transport' },
                { icon: '🛒', merchant: 'Coles', date: 'Jan 28, 2025', amount: '-$109.60', category: 'Groceries' },
                { icon: '💊', merchant: 'Chemist Warehouse', date: 'Jan 27, 2025', amount: '-$33.40', category: 'Health' },
                { icon: '🎬', merchant: 'Disney+', date: 'Jan 27, 2025', amount: '-$13.99', category: 'Subscription' },
                { icon: '🏋️', merchant: 'Fitness First', date: 'Jan 26, 2025', amount: '-$34.95', category: 'Fitness' }
>>>>>>> a15b3dc (userconfig changes; crypto wallet changes)
            ]
        },

        cryptojade: {
            id: 'cryptojade',
            name: 'Crypto Jade Card',
            shortName: 'Crypto Jade',
            lastFour: '9142',
            fullNumber: '•••• •••• •••• 9142',
            balance: '$0.00', // Will be calculated from crypto holdings
            balanceRaw: 0,
            image: 'images/AMEX/cryptojade.jpeg',
            memberSince: '2025',
            cardColor: '#00d4aa',
            isPrimary: false,
            isCrypto: true, // Flag to identify crypto card
            holdings: [
                { symbol: 'BTC', name: 'Bitcoin', amount: 21.5, icon: '₿' },
                { symbol: 'ETH', name: 'Ethereum', amount: 185.4, icon: 'Ξ' },
                { symbol: 'SOL', name: 'Solana', amount: 2850, icon: '◎' },
                { symbol: 'XRP', name: 'Ripple', amount: 125000, icon: '✕' },
                { symbol: 'ADA', name: 'Cardano', amount: 285000, icon: '₳' },
                { symbol: 'DOGE', name: 'Dogecoin', amount: 750000, icon: 'Ð' }
            ],
            transactions: [
                { icon: '₿', merchant: 'Bitcoin Purchase', date: 'Dec 12, 2025', amount: '+2.5 BTC', category: 'Crypto' },
                { icon: 'Ξ', merchant: 'ETH Staking Reward', date: 'Dec 10, 2025', amount: '+1.85 ETH', category: 'Staking' },
                { icon: '◎', merchant: 'Solana Accumulation', date: 'Dec 8, 2025', amount: '+350 SOL', category: 'Purchase' },
                { icon: '✕', merchant: 'XRP OTC Purchase', date: 'Dec 5, 2025', amount: '+25,000 XRP', category: 'OTC' },
                { icon: '₿', merchant: 'Cold Storage Transfer', date: 'Dec 3, 2025', amount: '-5.0 BTC', category: 'Transfer' },
                { icon: 'Ξ', merchant: 'Blue-chip NFT', date: 'Dec 1, 2025', amount: '-12.5 ETH', category: 'NFT' }
            ]
        }
    },

    // Financial Insights
    insights: {
        weeklySpending: {
            total: '$5,862.72',
            totalRaw: 5862.72,
            change: '+12%',
            changeDirection: 'up',
            period: 'Dec 7 - Dec 13',
            cardId: 'centurion'
        },
        monthlyBudget: {
            spent: 75000,
            limit: 100000,
            remaining: 25000
        }
    },

    // App Settings
    settings: {
        notifications: true,
        biometricLogin: true,
        darkMode: true,
        language: 'en',
        currency: 'AUD'
    }
};

// Helper function to get card by ID
function getCard(cardId) {
    return userConfig.cards[cardId] || null;
}

// Helper function to get primary card
function getPrimaryCard() {
    return Object.values(userConfig.cards).find(card => card.isPrimary) || null;
}

// Helper function to get all cards as array
function getAllCards() {
    return Object.values(userConfig.cards);
}

// Helper function to get total balance across all cards
function getTotalBalance() {
    return Object.values(userConfig.cards).reduce((sum, card) => sum + card.balanceRaw, 0);
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { userConfig, getCard, getPrimaryCard, getAllCards, getTotalBalance };
}