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