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
                { icon: '🛍️', merchant: 'Louis Vuitton', date: 'Dec 12, 2025', amount: '-$2,450.00', category: 'Shopping' },
                { icon: '✈️', merchant: 'Emirates Airlines', date: 'Dec 10, 2025', amount: '-$8,750.00', category: 'Travel' },
                { icon: '🍽️', merchant: 'Nobu Restaurant', date: 'Dec 8, 2025', amount: '-$485.00', category: 'Dining' },
                { icon: '🏨', merchant: 'Four Seasons Hotel', date: 'Dec 5, 2025', amount: '-$3,200.00', category: 'Travel' },
                { icon: '⛽', merchant: 'Shell Gas Station', date: 'Dec 4, 2025', amount: '-$95.40', category: 'Auto' },
                { icon: '🛒', merchant: 'Whole Foods Market', date: 'Dec 3, 2025', amount: '-$234.50', category: 'Groceries' },
                { icon: '💎', merchant: 'Tiffany & Co.', date: 'Dec 1, 2025', amount: '-$12,800.00', category: 'Shopping' },
                { icon: '🚗', merchant: 'Porsche Dealership', date: 'Nov 28, 2025', amount: '-$185,000.00', category: 'Auto' }
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
                { icon: '🎭', merchant: 'Broadway Tickets', date: 'Dec 11, 2025', amount: '-$1,850.00', category: 'Entertainment' },
                { icon: '🍷', merchant: 'Wine Collection', date: 'Dec 9, 2025', amount: '-$4,200.00', category: 'Shopping' },
                { icon: '🏌️', merchant: 'Country Club Membership', date: 'Dec 7, 2025', amount: '-$25,000.00', category: 'Lifestyle' },
                { icon: '👔', merchant: 'Hermès', date: 'Dec 6, 2025', amount: '-$8,900.00', category: 'Shopping' },
                { icon: '🎿', merchant: 'Aspen Ski Resort', date: 'Dec 4, 2025', amount: '-$15,600.00', category: 'Travel' },
                { icon: '🖼️', merchant: 'Art Gallery Purchase', date: 'Dec 2, 2025', amount: '-$45,000.00', category: 'Shopping' },
                { icon: '⌚', merchant: 'Rolex Boutique', date: 'Nov 30, 2025', amount: '-$32,500.00', category: 'Shopping' },
                { icon: '🛥️', merchant: 'Yacht Club Dues', date: 'Nov 25, 2025', amount: '-$18,000.00', category: 'Lifestyle' }
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
