          <div className="flex items-center gap-2">
            {Object.keys(linkPreviews).length > 0 && (
              <button
                onClick={() => setOpenPreviews(!openPreviews)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                  openPreviews
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                }`}
              >
                {openPreviews ? <EyeOff size={14} /> : <Eye size={14} />}
                {openPreviews ? "Editor" : "Gallery"}
              </button>
            )}
            <button
              onClick={() => {
                setIsRefreshing(true);
                setTimeout(() => {
                  setIsRefreshing(false);
                  addToast("Vault Refreshed");
                }, 1000);
              }}
              className="p-2.5 text-neutral-400 hover:text-black dark:hover:text-white transition-all rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              <RefreshCcw
                size={16}
                className={isRefreshing ? "animate-spin" : ""}
              />
            </button>
          </div>





        <div className="flex-1 relative z-10 overflow-y-auto w-full custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeNote ? (
              <motion.div
                key={activeId + (openPreviews ? "-preview" : "-editor")}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                className="max-w-4xl mx-auto h-full flex flex-col px-8 md:px-16 py-12 md:py-20"
              >
                <input
                  value={activeNote.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="text-4xl md:text-7xl font-serif italic tracking-tight w-full mb-12 outline-none bg-transparent placeholder:text-neutral-200 dark:placeholder:text-neutral-800 text-neutral-900 dark:text-white"
                  placeholder="The Title..."
                />

                {!openPreviews ? (
                  <textarea
                    value={activeNote.content}
                    onChange={(e) => updateField("content", e.target.value)}
                    className="flex-1 w-full resize-none outline-none bg-transparent text-lg md:text-2xl leading-[1.8] font-light text-neutral-600 dark:text-neutral-400 placeholder:text-neutral-300 dark:placeholder:text-neutral-700 pb-32"
                    placeholder="Pour your thoughts..."
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-32">
                    {Object.entries(linkPreviews).map(
                      ([url, preview], index) => (
                        <motion.a
                          key={url}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex flex-col bg-white dark:bg-[#111] rounded-[24px] overflow-hidden border border-neutral-100 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-2xl transition-all duration-500"
                        >
                          <div className="aspect-[16/10] overflow-hidden relative">
                            <img
                              src={preview.image}
                              alt={preview.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-4 left-4">
                              <div className="bg-black/50 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/10">
                                {preview.domain}
                              </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>

                          <div className="p-7 flex flex-col flex-1">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <h3 className="text-xl font-serif italic leading-tight group-hover:text-blue-500 transition-colors">
                                {preview.title}
                              </h3>
                              <ExternalLink
                                size={14}
                                className="text-neutral-300 mt-1"
                              />
                            </div>

                            <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed mb-6 flex-1">
                              {preview.description}
                            </p>

                            <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-medium tracking-tighter truncate">
                              <LinkIcon size={10} />
                              {url}
                            </div>
                          </div>
                        </motion.a>
                      )
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-8 text-neutral-200 dark:text-neutral-800 p-12">
                <div className="w-24 h-24 border-2 border-dashed border-neutral-100 dark:border-neutral-900 rounded-[40px] flex items-center justify-center">
                  <FileText size={48} strokeWidth={1} />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-serif italic text-neutral-400">
                    Vault Closed
                  </h2>
                  <p className="text-sm font-light">
                    Select a sheet from the archive to begin writing.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>