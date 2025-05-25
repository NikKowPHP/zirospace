// src/contexts/admin-context.tsx
'use client'

import { Service } from '@/domain/models/service.model';
import { useRouter } from 'next/navigation'; // Added import

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { CaseStudy } from '@/domain/models/models'
import { Locale } from '@/i18n'
import { CaseStudySlider } from '@/domain/models/case-study-slider.model'
import { Testimonial } from '@/domain/models/testimonial.model'
import { BlogPost } from '@/domain/models/blog-post.model'
import { Banner } from '@/domain/models/banner.model'
import toast from 'react-hot-toast' // Already present

interface OrderUpdate {
  id: string
  order: number
}

interface AdminContextType {
  caseStudies: Record<Locale, CaseStudy[]>
  caseStudySliders: CaseStudySlider[]
  testimonials: Record<Locale, Testimonial[]>
  blogPosts: Record<Locale, BlogPost[]>
  services: Record<Locale, Service[]>
  banners: Record<Locale, Banner[]>
  loading: boolean
  error: string | null
  createCaseStudy: (data: Partial<CaseStudy>, locale: Locale) => Promise<void>
  updateCaseStudy: (
    id: string,
    data: Partial<CaseStudy>,
    locale: Locale
  ) => Promise<void>
  deleteCaseStudy: (id: string, locale: Locale) => Promise<void>
  updateCaseStudyOrder: (orders: OrderUpdate[], locale: Locale) => Promise<void>
  createCaseStudySlider: (data: Partial<CaseStudySlider>) => Promise<void>
  updateCaseStudySlider: (
    id: string,
    data: Partial<CaseStudySlider>
  ) => Promise<void>
  deleteCaseStudySlider: (id: string) => Promise<void>

  createTestimonial: (
    data: Partial<Testimonial>,
    locale: Locale
  ) => Promise<void>
  updateTestimonial: (
    id: string,
    data: Partial<Testimonial>,
    locale: Locale
  ) => Promise<void>
  deleteTestimonial: (id: string, locale: Locale) => Promise<void>

  createBlogPost: (data: Partial<BlogPost>, locale: Locale) => Promise<void>
  updateBlogPost: (
    id: string,
    data: Partial<BlogPost>,
    locale: string
  ) => Promise<void>
  deleteBlogPost: (id: string, locale: Locale) => Promise<void>
  pinBlogPost: (id: string, locale: Locale) => Promise<void>

  createBanner: (data: Partial<Banner>, locale: Locale) => Promise<void>
  updateBanner: (
    id: string,
    data: Partial<Banner>,
    locale: Locale
  ) => Promise<void>
  deleteBanner: (id: string, locale: Locale) => Promise<void>

  clearError: () => void
  getTestimonials: (locale: Locale) => Promise<void>
  getCaseStudySliders: () => Promise<void>
  getBlogPosts: (locale: Locale) => Promise<void>
  getBlogPost: (id: string, locale: string) => Promise<BlogPost | null>
  getServices: (locale: Locale) => Promise<void>
  getServiceById: (id: string, locale: Locale) => Promise<Service | null>
  createService: (data: Partial<Service>, locale: Locale) => Promise<void>
  updateService: (id: string, data: Partial<Service>, locale: Locale) => Promise<void>
  deleteService: (id: string, locale: Locale) => Promise<void>
}

interface AdminProviderProps {
  children: React.ReactNode
  initialCaseStudies?: Record<Locale, CaseStudy[]>
  initialCaseStudySliders?: CaseStudySlider[]
  initialTestimonials?: Record<Locale, Testimonial[]>
  initialBlogPosts?: Record<Locale, BlogPost[]>
  initialBanners?: Record<Locale, Banner[]>
  initialServices?: Record<Locale, Service[]>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({
  children,
  initialCaseStudies,
  initialCaseStudySliders,
  initialTestimonials,
  initialBlogPosts,
  initialBanners,
  initialServices,
}: AdminProviderProps) {
  const router = useRouter(); // Initialized router
  const [caseStudies, setCaseStudies] = useState<Record<Locale, CaseStudy[]>>(
    initialCaseStudies || { en: [], pl: [] }
  )
  const [caseStudySliders, setCaseStudySliders] = useState<CaseStudySlider[]>(
    initialCaseStudySliders || []
  )
  const [testimonials, setTestimonials] = useState<
    Record<Locale, Testimonial[]>
  >(initialTestimonials || { en: [], pl: [] })
  const [blogPosts, setBlogPosts] = useState<Record<string, BlogPost[]>>(
    initialBlogPosts || { en: [], pl: [] }
  )
  const [banners, setBanners] = useState<Record<Locale, Banner[]>>(
    initialBanners || { en: [], pl: [] }
  )
  const [services, setServices] = useState<Record<Locale, Service[]>>(
    initialServices || { en: [], pl: [] }
  );
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialCaseStudies) {
      setCaseStudies(initialCaseStudies)
    }
  }, [initialCaseStudies])

  useEffect(() => {
    if (initialCaseStudySliders) {
      setCaseStudySliders(initialCaseStudySliders)
    }
  }, [initialCaseStudySliders])

  useEffect(() => {
    if (initialTestimonials) {
      setTestimonials(initialTestimonials)
    }
  }, [initialTestimonials])

  useEffect(() => {
    if (initialBlogPosts) {
      setBlogPosts(initialBlogPosts)
    }
  }, [initialBlogPosts])

  useEffect(() => {
    if (initialBanners) {
      setBanners(initialBanners)
    }
  }, [initialBanners]);

  useEffect(() => {
    if (initialServices) {
      setServices(initialServices);
    }
  }, [initialServices]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getServices = useCallback(async (locale: Locale) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/services?locale=${locale}`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices((prev) => ({ ...prev, [locale]: data }));
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, []);

  const getServiceById = useCallback(async (id: string, locale: string): Promise<Service | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/services?id=${id}&locale=${locale}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ details: 'Failed to fetch service details' }));
        throw new Error(errorData.details || 'Failed to fetch service');
      }
      const data = await response.json();
      return data;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to fetch service');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createService = async (data: Partial<Service>, locale: Locale) => {
    const promise = fetch(`/api/admin/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, locale }),
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create service' }));
        throw new Error(errorData.details || errorData.error || 'Failed to create service');
      }
      return response.json();
    });

    try {
      setLoading(true);
      setError(null);
      const newService = await toast.promise(promise, {
        loading: 'Creating service...',
        success: 'Service created successfully!',
        error: (err) => `Error: ${err.message}`,
      });
      setServices((prev) => ({
        ...prev,
        [locale]: [...(prev[locale] || []), newService],
      }));
      router.refresh(); // Added router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // Error already handled by toast
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id: string, data: Partial<Service>, locale: Locale) => {
    const promise = fetch(`/api/admin/services?id=${id}&locale=${locale}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update service' }));
        throw new Error(errorData.details || errorData.error || 'Failed to update service');
      }
      return response.json();
    });

    try {
      setLoading(true);
      setError(null);
      const updatedService = await toast.promise(promise, {
        loading: 'Updating service...',
        success: 'Service updated successfully!',
        error: (err) => `Error: ${err.message}`,
      });
      setServices((prev) => ({
        ...prev,
        [locale]: (prev[locale] || []).map((service) =>
          service.id === id ? updatedService : service
        ),
      }));
      router.refresh(); // Added router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // Error already handled by toast
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: string, locale: Locale) => {
    const promise = fetch(`/api/admin/services?id=${id}&locale=${locale}`, {
      method: 'DELETE',
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete service' }));
        throw new Error(errorData.details || errorData.error || 'Failed to delete service');
      }
      return response.json(); // Expect { success: true }
    });

    try {
      setLoading(true);
      setError(null);
      await toast.promise(promise, {
        loading: 'Deleting service...',
        success: 'Service deleted successfully!',
        error: (err) => `Error: ${err.message}`,
      });
      setServices((prev) => ({
        ...prev,
        [locale]: (prev[locale] || []).filter((service) => service.id !== id),
      }));
      router.refresh(); // Added router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // Error already handled by toast
    } finally {
      setLoading(false);
    }
  };

  // --- Case Study Management ---
  const createCaseStudy = async (data: Partial<CaseStudy>, locale: Locale) => {
    const promise = fetch(`/api/admin/case-studies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, locale }),
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create case study' }));
        throw new Error(errorData.details || errorData.error || 'Failed to create case study');
      }
      return response.json();
    });

    try {
      setLoading(true);
      setError(null);
      const newCaseStudy = await toast.promise(promise, {
        loading: 'Creating case study...',
        success: 'Case study created successfully!',
        error: (err) => `Error: ${err.message}`,
      });
      setCaseStudies((prev) => ({
        ...prev,
        [locale]: [...(prev[locale] || []), newCaseStudy],
      }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateCaseStudy = async (id: string, data: Partial<CaseStudy>, locale: Locale) => {
    const promise = fetch(`/api/admin/case-studies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, locale }),
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update case study' }));
        throw new Error(errorData.details || errorData.error || 'Failed to update case study');
      }
      return response.json();
    });

    try {
      setLoading(true);
      setError(null);
      const updatedCaseStudy = await toast.promise(promise, {
        loading: 'Updating case study...',
        success: 'Case study updated successfully!',
        error: (err) => `Error: ${err.message}`,
      });
      setCaseStudies((prev) => ({
        ...prev,
        [locale]: (prev[locale] || []).map((cs) =>
          cs.id === id ? updatedCaseStudy : cs
        ),
      }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteCaseStudy = async (id: string, locale: Locale) => {
    const promise = fetch(`/api/admin/case-studies/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale }),
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete case study' }));
        throw new Error(errorData.details || errorData.error || 'Failed to delete case study');
      }
      return response.json();
    });

    try {
      setLoading(true);
      setError(null);
      await toast.promise(promise, {
        loading: 'Deleting case study...',
        success: 'Case study deleted successfully!',
        error: (err) => `Error: ${err.message}`,
      });
      setCaseStudies((prev) => ({
        ...prev,
        [locale]: (prev[locale] || []).filter((cs) => cs.id !== id),
      }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateCaseStudyOrder = async (orders: OrderUpdate[], locale: Locale) => {
    const promise = fetch(`/api/admin/case-studies-order`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orders, locale }),
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update order' }));
        throw new Error(errorData.details || errorData.error || 'Failed to update order');
      }
      return response.json();
    });

    try {
      setLoading(true);
      setError(null);
      await toast.promise(promise, {
        loading: 'Updating case study order...',
        success: 'Order updated successfully!',
        error: (err) => `Error: ${err.message}`,
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // --- Case Study Slider Management ---
  const createCaseStudySlider = async (data: Partial<CaseStudySlider>) => {
    const promise = fetch(`/api/admin/case-study-sliders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create slider' }));
        throw new Error(errorData.details || errorData.error || 'Failed to create slider');
      }
      return response.json();
    });

    try {
      setLoading(true);
      setError(null);
      const newSlider = await toast.promise(promise, {
        loading: 'Creating case study slider...',
        success: 'Slider created successfully!',
        error: (err) => `Error: ${err.message}`,
      });
      setCaseStudySliders((prev) => [...prev, newSlider]);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateCaseStudySlider = async (id: string, data: Partial<CaseStudySlider>) => {
    const promise = fetch(`/api/admin/case-study-sliders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, id }),
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update slider' }));
        throw new Error(errorData.details || errorData.error || 'Failed to update slider');
      }
      return response.json();
    });

    try {
      setLoading(true);
      setError(null);
      const updatedSlider = await toast.promise(promise, {
        loading: 'Updating case study slider...',
        success: 'Slider updated successfully!',
        error: (err) => `Error: ${err.message}`,
      });
      setCaseStudySliders((prev) =>
        prev.map((slider) => (slider.id === id ? updatedSlider : slider))
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteCaseStudySlider = async (id: string) => {
    const promise = fetch(`/api/admin/case-study-sliders/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete slider' }));
        throw new Error(errorData.details || errorData.error || 'Failed to delete slider');
      }
      return response.json();
    });

    try {
      setLoading(true);
      setError(null);
      await toast.promise(promise, {
        loading: 'Deleting case study slider...',
        success: 'Slider deleted successfully!',
        error: (err) => `Error: ${err.message}`,
      });
      setCaseStudySliders((prev) => prev.filter((slider) => slider.id !== id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // --- Testimonial Management ---
  const createTestimonial = async (data: Partial<Testimonial>, locale: Locale) => {
    const promise = fetch(`/api/admin/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, locale }),
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create testimonial' }));
        throw new Error(errorData.details || errorData.error || 'Failed to create testimonial');
      }
      return response.json();
    });

    try {
      setLoading(true);
      setError(null);
      const newTestimonial = await toast.promise(promise, {
        loading: 'Creating testimonial...',
        success: 'Testimonial created successfully!',
        error: (err) => `Error: ${err.message}`,
      });
      setTestimonials((prev) => ({
        ...prev,
        [locale]: [...(prev[locale] || []), newTestimonial],
      }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateTestimonial = async (id: string, data: Partial<Testimonial>, locale: Locale) => {
    const promise = fetch(`/api/admin/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, locale }),
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update testimonial' }));
        throw new Error(errorData.details || errorData.error || 'Failed to update testimonial');
      }
      return response.json();
    });

    try {
      setLoading(true);
      setError(null);
      const updatedTestimonial = await toast.promise(promise, {
        loading: 'Updating testimonial...',
        success: 'Testimonial updated successfully!',
        error: (err) => `Error: ${err.message}`,
      });
      setTestimonials((prev) => ({
        ...prev,
        [locale]: (prev[locale] || []).map((t) =>
          t.id === id ? updatedTestimonial : t
        ),
      }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteTestimonial = async (id: string, locale: Locale) => {
    const promise = fetch(`/api/admin/testimonials/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale }),
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete testimonial' }));
        throw new Error(errorData.details || errorData.error || 'Failed to delete testimonial');
      }
      return response.json();
    });

    try {
      setLoading(true);
      setError(null);
      await toast.promise(promise, {
        loading: 'Deleting testimonial...',
        success: 'Testimonial deleted successfully!',
        error: (err) => `Error: ${err.message}`,
      });
      setTestimonials((prev) => ({
        ...prev,
        [locale]: (prev[locale] || []).filter((t) => t.id !== id),
      }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // --- Blog Post Management ---
  const createBlogPost = async (data: Partial<BlogPost>, locale: Locale) => {
    const promise = fetch(`/api/admin/blog-post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, locale }),
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create blog post' }));
        throw new Error(errorData.details || errorData.error || 'Failed to create blog post');
      }
      return response.json();
    });

    try {
      setLoading(true);
      setError(null);
      const newPost = await toast.promise(promise, {
        loading: 'Creating blog post...',
        success: 'Blog post created successfully!',
        error: (err) => `Error: ${err.message}`,
      });
      setBlogPosts((prev) => ({
        ...prev,
        [locale]: [...(prev[locale] || []), newPost],
      }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateBlogPost = async (id: string, data: Partial<BlogPost>, locale: string) => {
    const promise = fetch(`/api/admin/blog-post?id=${id}&locale=${locale}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update blog post' }));
        throw new Error(errorData.details || errorData.error || 'Failed to update blog post');
      }
      return response.json();
    });

    try {
      setLoading(true);
      setError(null);
      const updatedPost = await toast.promise(promise, {
        loading: 'Updating blog post...',
        success: 'Blog post updated successfully!',
        error: (err) => `Error: ${err.message}`,
      });
      setBlogPosts((prev) => ({
        ...prev,
        [locale]: (prev[locale] || []).map((post) =>
          post.id === id ? updatedPost : post
        ),
      }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteBlogPost = async (id: string, locale: Locale) => {
    const promise = fetch(`/api/admin/blog-post?id=${id}&locale=${locale}`, {
      method: 'DELETE',
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete blog post' }));
        throw new Error(errorData.details || errorData.error || 'Failed to delete blog post');
      }
      return response.json();
    });

    try {
      setLoading(true);
      setError(null);
      await toast.promise(promise, {
        loading: 'Deleting blog post...',
        success: 'Blog post deleted successfully!',
        error: (err) => `Error: ${err.message}`,
      });
      setBlogPosts((prev) => ({
        ...prev,
        [locale]: (prev[locale] || []).filter((post) => post.id !== id),
      }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const pinBlogPost = async (id: string, locale: Locale) => {
    const currentPosts = blogPosts[locale] || [];
    const postToPin = currentPosts.find(p => p.id === id);
    if (!postToPin) {
      setError(`Blog post with id ${id} not found.`);
      toast.error(`Blog post with id ${id} not found.`);
      return;
    }

    const updatedBlogPostsForLocale = currentPosts.map(p => ({
      ...p,
      isPinned: p.id === id ? true : false,
    }));

    setBlogPosts(prev => ({ ...prev, [locale]: updatedBlogPostsForLocale }));

    const operations = [];
    const currentlyPinned = currentPosts.find(p => p.isPinned && p.id !== id);
    if (currentlyPinned) {
      operations.push(
        fetch(`/api/admin/blog-post?id=${currentlyPinned.id}&locale=${locale}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { isPinned: false } }),
        }).then(async res => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Failed to unpin previous post' }));
            throw new Error(errorData.details || errorData.error || 'Failed to unpin previous post');
          }
          return res.json();
        })
      );
    }

    operations.push(
      fetch(`/api/admin/blog-post?id=${id}&locale=${locale}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { isPinned: true } }),
      }).then(async res => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: 'Failed to pin post' }));
          throw new Error(errorData.details || errorData.error || 'Failed to pin post');
        }
        return res.json();
      })
    );

    try {
      setLoading(true);
      setError(null);
      await toast.promise(
        Promise.all(operations),
        {
          loading: 'Updating pin status...',
          success: 'Pin status updated successfully!',
          error: (err) => `Error: ${err.message}`,
        }
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setBlogPosts(prev => ({ ...prev, [locale]: currentPosts }));
    } finally {
      setLoading(false);
    }
  };

  // --- Banner Management ---
  const createBanner = async (data: Partial<Banner>, locale: Locale) => {
    const promise = fetch(`/api/admin/banners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, locale }),
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create banner' }));
        throw new Error(errorData.details || errorData.error || 'Failed to create banner');
      }
      return response.json();
    });

    try {
      setLoading(true);
      setError(null);
      const newBanner = await toast.promise(promise, {
        loading: 'Creating banner...',
        success: 'Banner created successfully!',
        error: (err) => `Error: ${err.message}`,
      });
      setBanners((prev) => ({
        ...prev,
        [locale]: [...(prev[locale] || []), newBanner],
      }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateBanner = async (id: string, data: Partial<Banner>, locale: Locale) => {
    const promise = fetch(`/api/admin/banners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, locale }),
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update banner' }));
        throw new Error(errorData.details || errorData.error || 'Failed to update banner');
      }
      return response.json();
    });

    try {
      setLoading(true);
      setError(null);
      const updatedBanner = await toast.promise(promise, {
        loading: 'Updating banner...',
        success: 'Banner updated successfully!',
        error: (err) => `Error: ${err.message}`,
      });
      setBanners((prev) => ({
        ...prev,
        [locale]: (prev[locale] || []).map((b) =>
          b.id === id ? updatedBanner : b
        ),
      }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (id: string, locale: Locale) => {
    const promise = fetch(`/api/admin/banners/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale }),
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete banner' }));
        throw new Error(errorData.details || errorData.error || 'Failed to delete banner');
      }
      return response.json();
    });

    try {
      setLoading(true);
      setError(null);
      await toast.promise(promise, {
        loading: 'Deleting banner...',
        success: 'Banner deleted successfully!',
        error: (err) => `Error: ${err.message}`,
      });
      setBanners((prev) => ({
        ...prev,
        [locale]: (prev[locale] || []).filter((b) => b.id !== id),
      }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getTestimonials = useCallback(async (locale: Locale) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/testimonials?locale=${locale}`)
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials')
      }
      const data = await response.json()
      setTestimonials((prev) => ({ ...prev, [locale]: data }))
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch testimonials'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  const getCaseStudySliders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/case-study-sliders`)
      if (!response.ok) {
        throw new Error('Failed to fetch case study sliders')
      }
      const data = await response.json()
      setCaseStudySliders(data)
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch case study sliders'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  const getBlogPosts = useCallback(async (locale: Locale) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/blog-post?locale=${locale}`) // API route singular
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts')
      }
      const data = await response.json()
      setBlogPosts((prev) => ({ ...prev, [locale]: data }))
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch blog posts'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  const getBlogPost = useCallback(async (id: string, locale: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/blog-post?id=${id}&locale=${locale}`) // API route singular
      if (!response.ok) {
        throw new Error('Failed to fetch blog post')
      }
      const data = await response.json()
      return data
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch blog post'
      )
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <AdminContext.Provider
      value={{
        caseStudies,
        caseStudySliders,
        testimonials,
        blogPosts,
        services,
        banners,
        loading,
        error,
        createCaseStudy,
        updateCaseStudy,
        deleteCaseStudy,
        updateCaseStudyOrder,
        createCaseStudySlider,
        updateCaseStudySlider,
        deleteCaseStudySlider,
        createTestimonial,
        updateTestimonial,
        deleteTestimonial,
        createBlogPost,
        updateBlogPost,
        deleteBlogPost,
        pinBlogPost,
        createBanner,
        updateBanner,
        deleteBanner,
        clearError,
        getTestimonials,
        getCaseStudySliders,
        getBlogPosts,
        getBlogPost,
        getServices,
        getServiceById,
        createService,
        updateService,
        deleteService,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
