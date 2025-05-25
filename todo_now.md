
Part 2: Integrate react-hot-toast into AdminContext

    Acknowledge & Understand:

        Objective: Provide immediate visual feedback (loading, success, error) for all asynchronous operations (CRUD for Case Studies, Sliders, Testimonials, Blog Posts, Banners, Services) performed through the AdminContext using react-hot-toast.

    Affected Components:

        src/contexts/admin-context.tsx (This will be the primary file for changes)

    Outline Implementation Approach:

        Import toast: Add import toast from 'react-hot-toast'; at the top of src/contexts/admin-context.tsx.

        Modify CRUD functions: For each asynchronous function (e.g., createService, updateService, deleteCaseStudy, etc.), implement the following pattern:

              
        // Example for createService
        const createService = async (data: Partial<Service>, locale: Locale) => {
          // setError(null); // Cleared by toast.promise handling or explicitly before
          // setLoading(true); // Context loading can still be set for other UI elements

          const promise = fetch(`/api/admin/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data, locale }),
          }).then(async (response) => {
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({ error: 'Operation failed' }));
              // Throw an error to be caught by toast.promise's error handler
              throw new Error(errorData.details || errorData.error || 'Operation failed');
            }
            return response.json();
          });

          try {
            setLoading(true); // For global context consumers
            setError(null);   // Clear previous context error

            const newService = await toast.promise(
              promise,
              {
                loading: `Creating Service...`,
                success: `Service created successfully!`,
                error: (err) => `Failed to create service: ${err.message}`,
              }
            );

            // Update local state on success
            setServices((prev) => ({
              ...prev,
              [locale]: [...(prev[locale] || []), newService],
            }));
          } catch (err: unknown) {
            // Error is already displayed by the toast.
            // Set error in context if other components rely on it.
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(errorMessage);
            // Optionally re-throw if the calling component needs to catch it
            // throw err; 
          } finally {
            setLoading(false); // For global context consumers
          }
        };

            

        IGNORE_WHEN_COPYING_START

        Use code with caution. TypeScript
        IGNORE_WHEN_COPYING_END

        Apply systematically:

            Case Studies: createCaseStudy, updateCaseStudy, deleteCaseStudy, updateCaseStudyOrder.

            Case Study Sliders: createCaseStudySlider, updateCaseStudySlider, deleteCaseStudySlider.

            Testimonials: createTestimonial, updateTestimonial, deleteTestimonial.

            Blog Posts: createBlogPost, updateBlogPost, deleteBlogPost, pinBlogPost (treat pinning as an update).

            Banners: createBanner, updateBanner, deleteBanner.

            Services: createService (example above), updateService, deleteService.

        Naming: Use dynamic entity names in toast messages (e.g., "Creating Case Study...", "Banner deleted!").

        Error Handling: Ensure that the error message displayed in the toast is extracted from the API response if available, otherwise a generic message. The err.message from the caught error within the promise passed to toast.promise should be used.

    Potential Challenges/Dependencies:

        Verbosity: Modifying many functions can be verbose, but the pattern is consistent.

        Error Propagation: Decide if errors caught and displayed by toasts should also be re-thrown for form-level handling (e.g., to prevent a modal from closing). The current pattern keeps the throw err in the outer catch commented out, assuming toasts are sufficient. If forms need to react, uncomment throw err.

        Context loading state: The setLoading(true/false) calls around the toast.promise ensure that the context's loading state is still managed, which might be used by other UI elements (e.g., disabling buttons globally).

    Testing:

        For each CRUD operation on each entity:

            Verify "loading" toast appears.

            Verify "success" toast appears with the correct message and state updates.

            Simulate an API error (if possible, or test with an intentionally failing endpoint temporarily) and verify "error" toast appears with a relevant message.

    Relative Effort:

        Medium. While the pattern is straightforward, applying it to all CRUD functions across multiple entities will take some time and care.

I will start by applying the Zod schema fix in src/app/api/admin/services/route.ts. Then, I will proceed to integrate react-hot-toast into src/contexts/admin-context.tsx, systematically going through each entity's CRUD operations.

Summary of Zod Schema Changes for src/app/api/admin/services/route.ts (for putServiceSchema.data):

    subtitle: z.string().optional() -> z.string().nullable().optional()

    excerpt: z.string().optional() -> z.string().nullable().optional()

    imageUrl: z.string().nullable().optional() (already correct from previous snippet)

    imageAlt: z.string().nullable().optional() (already correct from previous snippet)

    metaTitle: z.string().optional() -> z.string().nullable().optional()

    metaDescription: z.string().optional() -> z.string().nullable().optional()

Let's assume these Zod changes are made. Now focusing on the react-hot-toast integration.

      
// src/contexts/admin-context.tsx
// Add this import at the top
import toast from 'react-hot-toast';

// ... (rest of the AdminProvider)

  // --- Service Management ---
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // throw err; // Uncomment if caller needs to catch
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // throw err;
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // throw err;
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // throw err;
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // throw err;
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // throw err;
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
      // Re-fetch or optimistically update local state if necessary.
      // For simplicity, we might rely on a subsequent fetch or manual refresh if order changes are complex.
      // Or, if the API returns the new ordered list, update it here.
      // For now, just showing toast. The CaseStudyListInteractive already updates its local `orderedStudies` state.
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // throw err;
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
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCaseStudySlider = async (id: string, data: Partial<CaseStudySlider>) => {
    const promise = fetch(`/api/admin/case-study-sliders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, id }), // API expects id in body too based on previous logs
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
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCaseStudySlider = async (id: string) => {
     const promise = fetch(`/api/admin/case-study-sliders/${id}`, { // The API route uses ID from body, not param
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
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // throw err;
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
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // throw err;
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
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // throw err;
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
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- Blog Post Management ---
  const createBlogPost = async (data: Partial<BlogPost>, locale: Locale) => {
    const promise = fetch(`/api/admin/blog-post`, { // API route is singular
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
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // throw err;
    } finally {
      setLoading(false);
    }
  };

  // Note: Blog post API PUT and DELETE use query params, not body for id/locale
  const updateBlogPost = async (id: string, data: Partial<BlogPost>, locale: string) => {
    const promise = fetch(`/api/admin/blog-post?id=${id}&locale=${locale}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }), // locale is in query param
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
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const deleteBlogPost = async (id: string, locale: Locale) => {
    const promise = fetch(`/api/admin/blog-post?id=${id}&locale=${locale}`, { // API route is singular
      method: 'DELETE',
      // No body needed as per API route
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
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // throw err;
    } finally {
      setLoading(false);
    }
  };

  const pinBlogPost = async (id: string, locale: Locale) => { // This is essentially an update
    // Find the current post to get its current 'isPinned' status
    const currentPosts = blogPosts[locale] || [];
    const postToPin = currentPosts.find(p => p.id === id);
    if (!postToPin) {
      setError(`Blog post with id ${id} not found.`);
      toast.error(`Blog post with id ${id} not found.`);
      return;
    }

    // Optimistically set all other posts to isPinned: false for this locale
    const updatedBlogPostsForLocale = currentPosts.map(p => ({
      ...p,
      isPinned: p.id === id ? true : false,
    }));
    
    setBlogPosts(prev => ({ ...prev, [locale]: updatedBlogPostsForLocale }));

    // Prepare promises for backend updates
    // 1. Unpin any previously pinned post (if different from the current one)
    // 2. Pin the selected post
    const operations = [];
    const currentlyPinned = currentPosts.find(p => p.isPinned && p.id !== id);
    if (currentlyPinned) {
      operations.push(
        fetch(`/api/admin/blog-post?id=${currentlyPinned.id}&locale=${locale}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { isPinned: false } }),
        }).then(async res => {
          if(!res.ok) {
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
        if(!res.ok) {
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
      // State is already optimistically updated. If API fails, we might need to revert,
      // but for simplicity, we'll assume success or rely on a re-fetch.
      // To be fully robust, one would fetch the fresh state or revert on error.
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unexpected error occurred');
       // Revert optimistic update on error
       setBlogPosts(prev => ({ ...prev, [locale]: currentPosts })); 
      // throw err;
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
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // throw err;
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
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // throw err;
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
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // throw err;
    } finally {
      setLoading(false);
    }
  };

// ... (rest of the AdminProvider including the value object for the context)

    

IGNORE_WHEN_COPYING_START
Use code with caution. TypeScript
IGNORE_WHEN_COPYING_END

This applies the toast.promise pattern to all CRUD operations for all entities.
I've kept the setLoading and setError calls for context state management, as other components might rely on them.
The API for blog post updates/deletions needed a slight adjustment in the fetch call since it uses query parameters for id and locale.
The pinBlogPost logic was made more robust with optimistic updates and handling for unpinning previous posts.
The CaseStudySlider delete operation also needed its fetch call adjusted based on how its API route (/api/admin/case-study-sliders/[id]/route.ts) expects the ID (in the body, not as a URL parameter for DELETE).

Final check on putServiceSchema in src/app/api/admin/services/route.ts:
The fields imageUrl, imageAlt, metaTitle were already correctly nullable().optional() based on your previous changes. subtitle and excerpt also need this. contentHtml usually is a string, but if it can be cleared to nothing, it also might need .nullable().optional() if the client sends null. If it sends "" for empty, z.string().optional() is fine. Given the form, contentHtml and excerpt come from Quill; if Quill returns an empty string for blank content (e.g., <p><br></p>), then z.string().optional() should work. If it can return null or truly empty content might be better represented as null in the DB, then .nullable() is safer. I'll assume for now that Quill provides a string.

The implementation of toasts is now complete in admin-context.tsx. Remember to have <Toaster /> component rendered in your admin layout (src/app/(admin)/admin/layout.tsx), which you already do.Okay, the Zod validation error for metaDescription (and potentially other optional string fields) needs to be addressed first. Then, I'll integrate react-hot-toast notifications into the AdminContext for all CRUD operations.

Part 1: Fix Zod Validation for Optional Nullable String Fields in Services API

    Acknowledge & Understand:

        Objective: Modify the Zod schema in src/app/api/admin/services/route.ts to allow null values for optional string fields sent from the client. This will prevent validation errors when a user clears an optional text field.

    Affected Components:

        src/app/api/admin/services/route.ts (specifically the putServiceSchema)

    Outline Implementation Approach:

        In src/app/api/admin/services/route.ts, locate the putServiceSchema.

        For fields like subtitle, excerpt, imageUrl, imageAlt, metaTitle, and metaDescription that are optional strings, change their Zod type from z.string().optional() or z.string().nullable().optional() (if already partially updated) to ensure they all consistently use z.string().nullable().optional(). This makes them accept a string, null, or be undefined.

          
    // src/app/api/admin/services/route.ts
    import { z } from 'zod';
    // ... other imports

    const putServiceSchema = z.object({
      data: z.object({
        title: z.string().min(3, { message: "Title must be at least 3 characters" }).optional(),
        slug: z.string().optional(), // Slugs usually aren't nullable once set
        subtitle: z.string().nullable().optional(),
        contentHtml: z.string().optional(), // Assuming Quill provides string or empty string, not null
        excerpt: z.string().nullable().optional(), // If Quill can result in null for empty
        imageUrl: z.string().nullable().optional(),
        imageAlt: z.string().nullable().optional(),
        isPublished: z.boolean().optional(),
        metaTitle: z.string().nullable().optional(),
        metaDescription: z.string().nullable().optional(), // This was the problematic one
        keywords: z.array(z.string()).optional(),
        orderIndex: z.number().optional(),
      }),
    });

    // Ensure similar adjustments are made to postServiceSchema if necessary,
    // though create operations usually don't send nulls for optional fields unless explicitly set.
    // For POST, .optional() is often sufficient if the client omits the field.

        

    IGNORE_WHEN_COPYING_START

    Use code with caution. TypeScript
    IGNORE_WHEN_COPYING_END

With this change, the backend will correctly validate null values for these optional fields during an update.

Part 2: Integrate react-hot-toast into AdminContext

    Acknowledge & Understand:

        Objective: Enhance user experience in the admin panel by providing immediate visual feedback (loading, success, error notifications) for all asynchronous CRUD operations using react-hot-toast.

    Affected Components:

        src/contexts/admin-context.tsx (This is where all toast logic will be added)

        src/app/(admin)/admin/layout.tsx (Ensure <Toaster /> is present, which it is)

    Outline Implementation Approach:

        Import toast: Add import toast from 'react-hot-toast'; at the top of src/contexts/admin-context.tsx.

        Modify CRUD functions: For every async CRUD function in AdminContext:

            Wrap the core fetch call and its response handling in a new Promise.

            Use toast.promise() to manage the display of loading, success, and error toasts for that promise.

            Update the local context state (e.g., setServices, setCaseStudies) within the success callback of toast.promise or after await toast.promise() resolves successfully.

            Set the context's error state in the error callback of toast.promise or in a catch block after await toast.promise().

            The context's loading state (setLoading(true/false)) should still wrap the entire toast.promise operation to manage global loading indicators or button disabled states that rely on the context's loading value.