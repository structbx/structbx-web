class CustomSelect
{
    constructor(element)
    {
        // 1. CORRECCIÓN: Usar variable local, no global
        const self = this;
        
        // 2. Guardar el selector/elemento original
        this.originalElement = element;
        this.containerSelector = element;
        
        // 3. Crear HTML primero
        this.html_element = $(`
            <div class="custom-select-container">

                <input type="hidden" class="selectValue" name="selected_option" value="">

                <div class="custom-select-display form-control d-flex justify-content-between align-items-center shadow-sm" tabindex="0">
                    <span class="selectedText">Selecciona una Opción...</span>
                    <i class="fas fa-chevron-down"></i>
                </div>

                <div class="custom-select-dropdown shadow-lg d-none">

                    <div class="p-2 border-bottom">
                        <input type="text" class="form-control searchBox" placeholder="Buscar opciones...">
                    </div>

                    <ul class="selectOptions custom-select-list list-unstyled mb-0">

                        <li data-value="op1" class="custom-select-item p-2">
                            <i class="fas fa-check-circle text-success me-2"></i>
                            <span class="fw-bold">Opción 1:</span> <span class="text-success small">Activo</span>
                        </li>

                        <li data-value="op2" class="custom-select-item p-2">
                            <i class="fas fa-exclamation-triangle text-warning me-2"></i>
                            <span class="fw-bold">Opción 2:</span>
                            <span class="badge bg-warning text-dark ms-2">Pendiente</span>
                        </li>

                        <li data-value="op3" class="custom-select-item p-2">
                            <i class="fas fa-times-circle text-danger me-2"></i>
                            <span class="fw-bold">Opción 3:</span> <span class="text-danger small">Bloqueado</span>
                        </li>

                        <li data-value="op4_largo" class="custom-select-item p-2">
                            <i class="fas fa-infinity text-info me-2"></i>
                            <span class="text-muted">Opción Larga:</span> Este es un ejemplo de ítem con texto extenso para probar el funcionamiento del buscador.
                        </li>
                    </ul>
                </div>
            </div>
        `);

        // 4. Agregar al DOM primero
        this.Build_();
        
        // 5. CORRECCIÓN: Buscar elementos DENTRO del contenedor ya creado
        // Usar find() en lugar de selectores concatenados
        this.container = $(element).find('.custom-select-container');
        this.display = this.container.find('.custom-select-display');
        this.dropdown = this.container.find('.custom-select-dropdown');
        this.options = this.container.find('.selectOptions');
        this.searchBox = this.container.find('.searchBox');
        this.hiddenInput = this.container.find('.selectValue');
        this.selectedText = this.container.find('.selectedText');

        console.log('CustomSelect inicializado:', {
            container: this.container,
            hiddenInput: this.hiddenInput
        });
    
        // --- 1. Manejo del Toggle del Dropdown ---
        this.display.on('click', (e) =>  // CORRECCIÓN: Usar arrow function
        {
            e.stopPropagation(); // Prevenir que el clic se propague al document
            this.dropdown.toggleClass('d-none');
            
            // Poner foco en la caja de búsqueda cuando se abre
            if (!this.dropdown.hasClass('d-none'))
            {
                setTimeout(() => this.searchBox.focus(), 50); // Pequeño delay para asegurar visibilidad
            }
        });

        // --- 2. Cierre del Dropdown al hacer clic fuera ---
        $(document).on('click', (e) =>
        {
            // CORRECCIÓN: Usar this.container en lugar de this.element
            if (!$(e.target).closest(this.container).length)
            {
                this.closeDropdown();
            }
        });

        // --- 3. Selección de Opciones y Actualización ---
        this.options.on('click', '.custom-select-item', function()
        {
            const $item = $(this);

            // a) Obtener el valor de datos y el contenido HTML enriquecido
            const selectedValue = $item.data('value');
            const selectedHtml = $item.html();

            // b) Actualizar el campo oculto para el envío del formulario
            self.hiddenInput.val(selectedValue);

            // c) Actualizar el texto visible del display con el contenido HTML
            self.selectedText.html(selectedHtml);

            // d) Marcar el ítem como seleccionado (estilo visual)
            self.options.find('.custom-select-item').removeClass('selected');
            $item.addClass('selected');

            // e) Cerrar el dropdown usando método
            self.closeDropdown();

            // f) Disparar evento personalizado para que otros scripts sepan
            self.container.trigger('customselect:change', [selectedValue, selectedHtml]);

            console.log(`Valor seleccionado: ${selectedValue}`);
        });

        // --- 4. Funcionalidad de Búsqueda Instantánea ---
        this.searchBox.on('keyup', function()
        {
            const searchText = $(this).val().toLowerCase().trim();

            self.options.find('.custom-select-item').each(function()
            {
                const $item = $(this);
                const itemText = $item.text().toLowerCase();

                if (itemText.includes(searchText))
                {
                    $item.removeClass('d-none'); // CORRECCIÓN: Usar d-none de Bootstrap
                }
                else
                {
                    $item.addClass('d-none');
                }
            });
        });

        // 6. Manejar tecla Escape para cerrar
        this.searchBox.on('keydown', function(e) {
            if (e.key === 'Escape') {
                self.closeDropdown();
            }
        });
    }
    
    // CORRECCIÓN: Método para cerrar dropdown (reusable)
    closeDropdown() {
        this.dropdown.addClass('d-none');
        this.display.focus();
        
        // Limpiar la búsqueda al cerrar
        this.searchBox.val('');
        this.options.find('.custom-select-item').removeClass('d-none');
    }
    
    // CORRECCIÓN: Método Build mejorado
    Build_()
    {
        // Limpiar el elemento original primero
        $(this.originalElement).empty().append(this.html_element);
        
        // Si es un input existente, copiar valor inicial
        const originalInput = $(this.originalElement).find('input[type="hidden"]');
        if (originalInput.length) {
            const initialValue = originalInput.val();
            if (initialValue) {
                this.setValue(initialValue);
            }
        }
    }
    
    // MÉTODO NUEVO: Establecer valor programáticamente
    setValue(value) {
        const $item = this.options.find(`[data-value="${value}"]`);
        if ($item.length) {
            $item.trigger('click');
            return true;
        }
        return false;
    }
    
    // MÉTODO NUEVO: Obtener valor actual
    getValue() {
        return this.hiddenInput.val();
    }
    
    // MÉTODO NUEVO: Obtener texto actual
    getText() {
        return this.selectedText.text();
    }
    
    // MÉTODO NUEVO: Agregar opción dinámicamente
    addOption(value, html, data = {}) {
        const $newItem = $(`
            <li data-value="${value}" class="custom-select-item p-2">
                ${html}
            </li>
        `);
        
        // Agregar datos adicionales si existen
        if (data.class) $newItem.addClass(data.class);
        if (data.icon) $newItem.prepend(`<i class="${data.icon} me-2"></i>`);
        
        this.options.append($newItem);
        return $newItem;
    }
    
    // MÉTODO NUEVO: Remover opción
    removeOption(value) {
        const $item = this.options.find(`[data-value="${value}"]`);
        if ($item.length) {
            // Si es el item seleccionado, limpiar selección
            if ($item.hasClass('selected')) {
                this.hiddenInput.val('');
                this.selectedText.html('Selecciona una Opción...');
            }
            $item.remove();
            return true;
        }
        return false;
    }
    
    // MÉTODO NUEVO: Habilitar/deshabilitar
    setDisabled(disabled) {
        if (disabled) {
            this.display.addClass('disabled').attr('tabindex', '-1');
            this.container.addClass('disabled');
        } else {
            this.display.removeClass('disabled').attr('tabindex', '0');
            this.container.removeClass('disabled');
        }
    }
    
    // MÉTODO NUEVO: Destructor
    destroy() {
        // Remover event listeners
        this.display.off('click');
        $(document).off('click');
        this.options.off('click');
        this.searchBox.off('keyup keydown');
        
        // Remover HTML
        $(this.originalElement).empty();
        
        // Limpiar referencias
        this.container = null;
        this.display = null;
        this.dropdown = null;
        this.options = null;
        this.searchBox = null;
        this.hiddenInput = null;
        this.selectedText = null;
    }
};