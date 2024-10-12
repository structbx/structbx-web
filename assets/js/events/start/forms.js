$(function()
{

    // SELECT options
    const options_states = new wtools.SelectOptions
    ([
        new wtools.OptionValue("activo", "Activo", true)
        ,new wtools.OptionValue("inactivo", "Inactivo")
    ]);
    options_states.Build_('#component_forms_add select[name="state"]');
    options_states.Build_('#component_forms_modify select[name="state"]');

    const options_privacity = new wtools.SelectOptions
    ([
        new wtools.OptionValue("publico", "P&uacute;blico", true)
        ,new wtools.OptionValue("interno", "Interno")
    ]);
    options_privacity.Build_('#component_forms_add select[name="privacity"]');
    options_privacity.Build_('#component_forms_modify select[name="privacity"]');

    // Read
    const form_read = () =>
    {
        // Wait animation
        let wait = new wtools.ElementState('#component_forms_read .notifications', false, 'block', new wtools.WaitAnimation().for_block);

        // Request
        new wtools.Request(server_config.current.api + "/forms/read").Exec_((response_data) =>
        {
            // Clean
            wait.Off_();
            $('#component_forms_read .notifications').html('');
            $('#component_forms_read table tbody').html('');

            // Permissions error
            if(response_data.status == 401)
            {
                new wtools.Notification('WARNING', 0, '#component_forms_read .notifications').Show_('No tiene permisos para acceder a este recurso.');
                return;
            }

            // Notification Error
            if(response_data.status != 200)
            {
                new wtools.Notification('WARNING', 0, '#component_forms_read .notifications').Show_('No se pudo acceder a los formularios.');
                return;
            }

            // Handle no results or zero results
            if(response_data.body.data == undefined || response_data.body.data.length < 1)
            {
                new wtools.Notification('SUCCESS', 0, '#component_forms_read .notifications').Show_('Sin resultados.');
                return;
            }

            // Results elements creator
            $('#component_forms_read .contents').html('');
            let elements = []; let cont = 0;
            for(let row of response_data.body.data)
            {
                if(cont < 2)
                {
                    elements.push(`
                        <div class="col-12 col-sm-6 col-xxl-3 d-flex mb-4">
							<div class="card flex-fill">
								<div class="card-body py-4">
									<div class="d-flex align-items-start">
										<div class="flex-grow-1">
											<h3 class="mb-2">
                                                <a class="text-decoration-none text-dark" href="../form?identifier=${row.identifier}">
                                                    ${row.name}
                                                </a>
                                            </h3>
											<p class="mb-2 text-muted">Formulario</p>
											<div class="mb-0">
												<span class="badge bg-secondary me-2"> +10k de registros </span>
											</div>
										</div>
										<div class="d-inline-block ms-3">
											<div class="stat">
                                                <div class="dropdown">
                                                    <a class="text-dark" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <i class="fas fa-ellipsis-h"></i>
                                                    </a>
                                                    <ul class="dropdown-menu">
                                                        <li>
                                                            <a class="dropdown-item modify" form_id="${row.id}" form_name="${row.name}">
                                                                Editar
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a class="dropdown-item delete" form_id="${row.id}" form_name="${row.name}">
                                                                Eliminar
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>    
                    `);
                }
                else
                {
                    let ui_element = new wtools.UIElementsPackage('<div class="row"></div>', elements).Pack_();
                    $('#component_forms_read .contents').append(ui_element);
                    cont = 0;
                    elements = [];
                }
            }
            if(elements.length > 0)
            {
                let ui_element = new wtools.UIElementsPackage('<div class="row"></div>', elements).Pack_();
                $('#component_forms_read .contents').append(ui_element);
            }
        });
    };
    form_read();
    $('#component_forms_read .update').click(() => form_read());
    
    // Add
    $('#component_forms_add form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_forms_add form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            $('#component_forms_add .notifications').html('');
            wait.Off_();
            new wtools.Notification('WARNING', 5000, '#component_forms_add .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Data collection
        const data = new FormData();
        data.append("identifier", $('#component_forms_add input[name="identifier"]').val());
        data.append("name", $('#component_forms_add input[name="name"]').val());
        data.append("state", $('#component_forms_add select[name="state"]').val());
        data.append("privacity", $('#component_forms_add select[name="privacity"]').val());
        data.append("description", $('#component_forms_add textarea[name="description"]').val());

        // Request
        new wtools.Request(server_config.current.api + "/forms/add", "POST", data, false).Exec_((response_data) =>
        {
            wait.Off_();

            // Notifications
            if(response_data.status == 200)
            {
                new wtools.Notification('SUCCESS').Show_('Formulario creado exitosamente.');
                $('#component_forms_add').modal('hide');
                form_read();
            }
            else
            {
                new wtools.Notification('ERROR', 0, '#component_forms_add .notifications').Show_('Hubo un error al crear el formulario: ' + response_data.body.message);
            }
        });
    });

    // Read Form to Modify
    $(document).on("click", '#component_forms_read .contents .modify', (e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

        // Form data
        const form_id = $(e.target).attr('form_id');
        const form_name = $(e.target).attr('form_name');

        // Setup form to modify
        $('#component_forms_modify input[name="id"]').val(form_id);
        $('#component_forms_modify .modal-title strong.header').html(form_name);
        
        // Read form to modify
        new wtools.Request(server_config.current.api + `/forms/read/id?id=${form_id}`).Exec_((response_data) =>
        {
            if(response_data.status != 200)
            {
                $(':input','#component_forms_modify form')
                    .not(':button, :submit, :reset, :hidden')
                    .val('')
                    .prop('checked', false)
                    .prop('selected', false);
                wait.Off_();
                new wtools.Notification('WARNING').Show_('No se pudo acceder al formulario.');
                return;
            }
            
            $('#component_forms_modify input[name="identifier"]').val(response_data.body.data[0].identifier);
            $('#component_forms_modify input[name="name"]').val(response_data.body.data[0].name);
            $('#component_forms_modify select[name="state"]').val(response_data.body.data[0].state);
            $('#component_forms_modify select[name="privacity"]').val(response_data.body.data[0].privacity);
            $('#component_forms_modify textarea[name="description"]').val(response_data.body.data[0].description);

            wait.Off_();
            $('#component_forms_modify').modal('show');
        });
    });

    // Modify form
    $('#component_forms_modify form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_forms_modify form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Form check
        const check = new wtools.FormChecker(e.target).Check_();
        if(!check)
        {
            wait.Off_();
            $('#component_forms_modify .notifications').html('');
            new wtools.Notification('WARNING', 5000, '#component_forms_modify .notifications').Show_('Hay campos inv&aacute;lidos.');
            return;
        }

        // Data collection
        const new_data = new FormData();
        new_data.append("id", $('#component_forms_modify input[name="id"]').val());
        new_data.append("identifier", $('#component_forms_modify input[name="identifier"]').val());
        new_data.append("name", $('#component_forms_modify input[name="name"]').val());
        new_data.append("state", $('#component_forms_modify select[name="state"]').val());
        new_data.append("privacity", $('#component_forms_modify select[name="privacity"]').val());
        new_data.append("description", $('#component_forms_modify textarea[name="description"]').val());

        // Request
        new wtools.Request(server_config.current.api + "/forms/modify", "PUT", new_data, false).Exec_((response_data) =>
        {
            wait.Off_();
            if(response_data.status == 200)
            {
                new wtools.Notification('SUCCESS').Show_('Formulario modificado exitosamente.');
                $('#component_forms_modify').modal('hide');
                form_read();
            }
            else
            {
                new wtools.Notification('ERROR', 0, '#component_forms_modify .notifications').Show_('Hubo un error al modificar el formulario: ' + response_data.body.message);
            }
        });
    });

    // Read form to Delete
    $(document).on("click", '#component_forms_read .delete', (e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#wait_animation_page', true, 'block', new wtools.WaitAnimation().for_page);

        // Form data
        const form_id = $(e.target).attr('form_id');
        const form_name = $(e.target).attr('form_name');

        // Setup form to delete
        $('#component_forms_delete input[name=id]').val(form_id);
        $('#component_forms_delete strong.header').html(form_name);
        $('#component_forms_delete strong.name').html(form_name);
        $('#component_forms_delete').modal('show');
        wait.Off_();
    });

    // Delete form
    $('#component_forms_delete form').submit((e) =>
    {
        e.preventDefault();

        // Wait animation
        let wait = new wtools.ElementState('#component_forms_delete form button[type=submit]', true, 'button', new wtools.WaitAnimation().for_button);

        // Data
        const form_id = $('#component_forms_delete input[name=id]').val();

        // Request
        new wtools.Request(server_config.current.api + `/forms/delete?id=${form_id}`, "DEL").Exec_((response_data) =>
        {
            wait.Off_();

            if(response_data.status == 200)
            {
                form_read();
                new wtools.Notification('SUCCESS').Show_('Formulario eliminado exitosamente.');
                $('#component_forms_delete').modal('hide');
            }
            else
            {
                new wtools.Notification('ERROR', 0, '#component_forms_delete .notifications').Show_('Hubo un error al eliminar el formulario: ' + response_data.body.message);
            }
        });
    });
});