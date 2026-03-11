import { create } from 'zustand'

export const useBookingStore = create((set) => ({
  selectedSeats: [],
  bookingData: null,
  selectSeat: (seatNumber) =>
    set((state) => ({
      selectedSeats: state.selectedSeats.includes(seatNumber)
        ? state.selectedSeats.filter((seat) => seat !== seatNumber)
        : [...state.selectedSeats, seatNumber]
    })),
  clearSeats: () => set({ selectedSeats: [] }),
  setBookingData: (bookingData) => set({ bookingData })
}))
