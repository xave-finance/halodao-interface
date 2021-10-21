import { firestore } from './firebase'

describe('firestore', () => {
  describe('pending rewards', () => {
    it('can read pending rewards', async () => {
      const querySnapshot = await firestore.collection('pendingRewards').get()
      expect(querySnapshot.docs).not.toBeNull
    })
  })
})
