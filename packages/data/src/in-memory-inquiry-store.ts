import type { InquiryStore } from './inquiry-intake';
import type { QualifiedInquiry } from './qualified-inquiry';

export function createInMemoryInquiryStore(): InquiryStore {
  const inquiries: QualifiedInquiry[] = [];

  return {
    save(inquiry) {
      inquiries.push(inquiry);
      return Promise.resolve();
    },
    list(limit) {
      const newestFirst = [...inquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return Promise.resolve(newestFirst.slice(0, limit));
    },
  };
}
